package com.teatroreal.service.tops;

import com.teatroreal.domain.tops.AuditLog;
import com.teatroreal.repository.tops.AuditLogRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Servicio para gestionar el audit log (historial de cambios)
 * Registra todas las acciones sobre guiones, actos, escenas y elementos
 *
 * Nota: implementa el guardado del audit log con JDBC directo (en transacción REQUIRES_NEW)
 * y detecta dinámicamente el nombre de la columna para 'entity type' (por si la BD tiene nombres
 * antiguos en español). Esto evita problemas con mapeos JPA / esquema heredado y evita que un fallo
 * en el audit_log marque la transacción principal como rollback-only.
 */
@Service
@Transactional
@Slf4j
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final DataSource dataSource;

    // Cache de columnas detectadas para no preguntar metadata en cada inserción
    private final Set<String> auditLogColumns = new HashSet<>();

    public AuditLogService(AuditLogRepository auditLogRepository, DataSource dataSource) {
        this.auditLogRepository = auditLogRepository;
        this.dataSource = dataSource;
    }

    /**
     * Registra una acción en el audit log usando JDBC directo en una transacción nueva.
     * Si no se puede guardar el registro, se captura el error y no se propaga para no romper la operación principal.
     *
     * @param entityType Tipo de entidad (GUION, ACTO, ESCENA, ELEMENTO, etc.)
     * @param entityId ID de la entidad (UUID string)
     * @param action Acción realizada (CREATE, UPDATE, DELETE, REORDER, LOCK, UNLOCK)
     * @param userId ID del usuario que realizó la acción (UUID string)
     * @param userEmail Email del usuario
     * @param diffJson JSON con los cambios realizados (opcional)
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void registrarAccion(
            String entityType,
            String entityId,
            String action,
            String userId,
            String userEmail,
            String diffJson
    ) {
        // Construimos un intento de persistencia robusto: detectar columnas y usar INSERT SQL directo.
        try (Connection conn = dataSource.getConnection()) {
            ensureAuditLogColumns(conn);

            // Determinar el nombre de la columna para el tipo de entidad
            String entityTypeColumn = null;
            if (auditLogColumns.contains("entity_type")) {
                entityTypeColumn = "entity_type";
            } else if (auditLogColumns.contains("entidad_tipo")) {
                entityTypeColumn = "entidad_tipo";
            } else if (auditLogColumns.contains("ENTIDAD_TIPO")) {
                entityTypeColumn = "ENTIDAD_TIPO";
            }

            // Construir SQL dinámico según las columnas existentes
            StringBuilder cols = new StringBuilder();
            StringBuilder vals = new StringBuilder();
            // columns we always try to set
            cols.append("action,diff_json,entity_id");
            vals.append("?,?,?");

            if (entityTypeColumn != null) {
                cols.append(",").append(entityTypeColumn);
                vals.append(",?");
            }

            cols.append(",timestamp,user_email,user_id");
            vals.append(",?, ?, ?");

            String sql = "INSERT INTO audit_log (" + cols.toString() + ") VALUES (" + vals.toString() + ")";

            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                int idx = 1;
                ps.setString(idx++, action);
                ps.setString(idx++, diffJson);
                ps.setString(idx++, entityId);

                if (entityTypeColumn != null) {
                    ps.setString(idx++, entityType);
                }

                // timestamp
                ps.setObject(idx++, LocalDateTime.now());
                ps.setString(idx++, userEmail);
                ps.setString(idx, userId);

                ps.executeUpdate();
            } catch (SQLException ex) {
                // Capturamos errores del INSERT y lo loggeamos sin propagar
                log.error("No se pudo guardar registro de audit_log (se omite): entityType={}, entityId={}, action={}, userEmail={}. Error: {}",
                        entityType, entityId, action, userEmail, ex.getMessage(), ex);
            }
        } catch (SQLException e) {
            log.error("Error al obtener conexión para audit_log (se omite): {}", e.getMessage(), e);
        }
    }

    /**
     * Registra una acción sin JSON de diferencias
     */
    public void registrarAccion(
            String entityType,
            String entityId,
            String action,
            String userId,
            String userEmail
    ) {
        registrarAccion(entityType, entityId, action, userId, userEmail, null);
    }

    /**
     * Obtiene el historial de cambios de una entidad
     *
     * @param entityType Tipo de entidad
     * @param entityId ID de la entidad (UUID string)
     * @return Lista de registros de audit ordenados por timestamp descendente
     */
    public List<AuditLog> obtenerHistorial(String entityType, String entityId) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByTimestampDesc(entityType, entityId);
    }

    /**
     * Obtiene el historial de cambios de un usuario
     *
     * @param userId ID del usuario (UUID string)
     * @return Lista de registros de audit del usuario
     */
    public List<AuditLog> obtenerHistorialPorUsuario(String userId) {
        return auditLogRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    /**
     * Obtiene registros de audit en un rango de fechas
     *
     * @param inicio Fecha/hora de inicio
     * @param fin Fecha/hora de fin
     * @return Lista de registros dentro del rango
     */
    public List<AuditLog> obtenerHistorialPorFecha(LocalDateTime inicio, LocalDateTime fin) {
        return auditLogRepository.findByTimestampBetweenOrderByTimestampDesc(inicio, fin);
    }

    /**
     * Obtiene todos los registros de audit ordenados por timestamp descendente
     *
     * @return Lista completa del audit log
     */
    public List<AuditLog> obtenerTodoHistorial() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    /**
     * Cuenta el número de acciones por tipo de acción
     *
     * @param action Tipo de acción a contar
     * @return Número de registros con esa acción
     */
    public long contarAccionesPorTipo(String action) {
        return auditLogRepository.countByAction(action);
    }

    /**
     * Limpia registros de audit antiguos (más de X días)
     * Nota: Configurar la cantidad de días en properties
     *
     * @param diasAtras Número de días hacia atrás a conservar
     * @return Número de registros eliminados
     */
    public long limpiarHistorialAntiguo(int diasAtras) {
        LocalDateTime fecha = LocalDateTime.now().minusDays(diasAtras);
        return auditLogRepository.deleteByTimestampBefore(fecha);
    }

    /**
     * Rellena la cache 'auditLogColumns' con los nombres de columnas existentes en la tabla audit_log.
     * Ejecutar una sola vez por arranque (si la cache ya tiene valores, no hace nada).
     */
    private void ensureAuditLogColumns(Connection conn) {
        if (!auditLogColumns.isEmpty()) {
            return;
        }
        try (ResultSet rs = conn.getMetaData().getColumns(null, null, "AUDIT_LOG", null)) {
            while (rs.next()) {
                String col = rs.getString("COLUMN_NAME");
                if (col != null) {
                    auditLogColumns.add(col.toLowerCase());
                    auditLogColumns.add(col); // añadir también la versión original (por si se busca con mayúsculas)
                }
            }
        } catch (SQLException e) {
            log.warn("No se pudo leer metadata de audit_log: {}", e.getMessage());
        }
    }
}
