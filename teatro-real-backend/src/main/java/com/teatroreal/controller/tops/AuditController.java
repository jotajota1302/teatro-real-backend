package com.teatroreal.controller.tops;

import com.teatroreal.domain.tops.AuditLog;
import com.teatroreal.service.tops.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Controller REST para auditoría y historial de cambios
 * Según reglas-tops1.md: Historial de cambios auditado
 */
@RestController
@RequestMapping("/api/tops/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditLogService auditLogService;

    /**
     * GET /api/tops/audit/entity/{entityType}/{entityId}
     * Obtiene el historial de cambios de una entidad específica
     */
    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<List<AuditLog>> getEntityAuditLog(
            @PathVariable String entityType,
            @PathVariable String entityId) {
        List<AuditLog> logs = auditLogService.obtenerHistorial(entityType, entityId);
        return ResponseEntity.ok(logs);
    }

    /**
     * GET /api/tops/audit/guion/{guionId}
     * Obtiene todos los cambios realizados en un guión
     */
    @GetMapping("/guion/{guionId}")
    public ResponseEntity<List<AuditLog>> getGuionAuditLog(@PathVariable String guionId) {
        List<AuditLog> logs = auditLogService.obtenerHistorial("GUION", guionId);
        return ResponseEntity.ok(logs);
    }

    /**
     * GET /api/tops/audit/user/{userId}
     * Obtiene todos los cambios realizados por un usuario
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AuditLog>> getUserAuditLog(@PathVariable String userId) {
        List<AuditLog> logs = auditLogService.obtenerHistorialPorUsuario(userId);
        return ResponseEntity.ok(logs);
    }

    /**
     * GET /api/tops/audit/recent
     * Obtiene los cambios más recientes del sistema
     */
    @GetMapping("/recent")
    public ResponseEntity<List<AuditLog>> getRecentAuditLogs() {
        List<AuditLog> logs = auditLogService.obtenerTodoHistorial();
        return ResponseEntity.ok(logs);
    }

    /**
     * GET /api/tops/audit/range
     * Obtiene cambios en un rango de fechas
     */
    @GetMapping("/range")
    public ResponseEntity<List<AuditLog>> getAuditLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        List<AuditLog> logs = auditLogService.obtenerHistorialPorFecha(from, to);
        return ResponseEntity.ok(logs);
    }

    /**
     * GET /api/tops/audit/action/{action}/count
     * Cuenta las acciones de un tipo específico
     */
    @GetMapping("/action/{action}/count")
    public ResponseEntity<Long> countActionsByType(@PathVariable String action) {
        long count = auditLogService.contarAccionesPorTipo(action);
        return ResponseEntity.ok(count);
    }
}
