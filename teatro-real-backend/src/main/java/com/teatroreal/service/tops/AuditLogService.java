package com.teatroreal.service.tops;

import com.teatroreal.domain.tops.AuditLog;
import com.teatroreal.repository.tops.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Servicio para gestionar el audit log (historial de cambios)
 * Registra todas las acciones sobre guiones, actos, escenas y elementos
 */
@Service
@Transactional
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    /**
     * Registra una acción en el audit log
     *
     * @param entityType Tipo de entidad (GUION, ACTO, ESCENA, ELEMENTO, etc.)
     * @param entityId ID de la entidad (UUID string)
     * @param action Acción realizada (CREATE, UPDATE, DELETE, REORDER, LOCK, UNLOCK)
     * @param userId ID del usuario que realizó la acción (UUID string)
     * @param userEmail Email del usuario
     * @param diffJson JSON con los cambios realizados (opcional)
     */
    public void registrarAccion(
            String entityType,
            String entityId,
            String action,
            String userId,
            String userEmail,
            String diffJson
    ) {
        AuditLog log = new AuditLog();
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setAction(action);
        log.setUserId(userId);
        log.setUserEmail(userEmail);
        log.setTimestamp(LocalDateTime.now());
        log.setDiffJson(diffJson);

        auditLogRepository.save(log);
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
}
