package com.teatroreal.repository.tops;

import com.teatroreal.domain.tops.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio JPA para AuditLog
 * Consultas para historial de cambios
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    /**
     * Obtiene el historial de cambios de una entidad específica
     */
    List<AuditLog> findByEntityTypeAndEntityIdOrderByTimestampDesc(String entityType, String entityId);

    /**
     * Obtiene el historial de cambios de un usuario
     */
    List<AuditLog> findByUserIdOrderByTimestampDesc(String userId);

    /**
     * Obtiene registros de audit en un rango de fechas
     */
    List<AuditLog> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime inicio, LocalDateTime fin);

    /**
     * Obtiene todos los registros ordenados por timestamp descendente
     */
    List<AuditLog> findAllByOrderByTimestampDesc();

    /**
     * Cuenta el número de acciones por tipo
     */
    long countByAction(String action);

    /**
     * Elimina registros más antiguos que una fecha específica
     */
    long deleteByTimestampBefore(LocalDateTime fecha);
}
