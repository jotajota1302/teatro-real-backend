package com.teatroreal.controller.tops;

import com.teatroreal.domain.tops.Guion;
import com.teatroreal.dto.request.GuionRequest;
import com.teatroreal.dto.response.GuionResponse;
import com.teatroreal.dto.response.GuionCompletoResponse;
import com.teatroreal.service.tops.GuionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/guiones")
@Tag(name = "Guiones", description = "Gestión de guiones técnicos - TOPS")
public class GuionController {

    @Autowired
    private GuionService guionService;

    @GetMapping
    @Operation(summary = "Listar todos los guiones")
    public ResponseEntity<List<GuionResponse>> findAll(
            @RequestParam(required = false) String temporada) {
        List<GuionResponse> guiones;
        if (temporada != null && !temporada.isEmpty()) {
            guiones = guionService.findByTemporada(temporada);
        } else {
            guiones = guionService.findAll();
        }
        return ResponseEntity.ok(guiones);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener guion por ID (metadata)")
    public ResponseEntity<GuionResponse> findById(@PathVariable String id) {
        return ResponseEntity.ok(guionService.findById(id));
    }

    @GetMapping("/{id}/completo")
    @Operation(summary = "Obtener guion completo con todo el árbol (para editor)")
    public ResponseEntity<GuionCompletoResponse> findByIdCompleto(@PathVariable String id) {
        return ResponseEntity.ok(guionService.findByIdCompleto(id));
    }

    @PostMapping
    @Operation(summary = "Crear nuevo guion")
    public ResponseEntity<GuionResponse> create(
            @Valid @RequestBody GuionRequest request,
            @RequestParam(defaultValue = "3") int numActos,
            Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : null;
        GuionResponse guion = guionService.createWithActos(request, numActos, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(guion);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar guion")
    public ResponseEntity<GuionResponse> update(
            @PathVariable String id,
            @Valid @RequestBody GuionRequest request) {
        return ResponseEntity.ok(guionService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar guion")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        guionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== Bloqueo de Edición ====================

    @PostMapping("/{id}/lock")
    @Operation(summary = "Bloquear guion para edición exclusiva")
    public ResponseEntity<GuionResponse> lockGuion(
            @PathVariable String id,
            Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : null;
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(guionService.lockGuion(id, userId));
    }

    @DeleteMapping("/{id}/lock")
    @Operation(summary = "Desbloquear guion")
    public ResponseEntity<GuionResponse> unlockGuion(
            @PathVariable String id,
            Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : null;
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(guionService.unlockGuion(id, userId));
    }

    @DeleteMapping("/{id}/lock/force")
    @Operation(summary = "Forzar desbloqueo (solo admin)")
    public ResponseEntity<GuionResponse> forceUnlock(@PathVariable String id) {
        return ResponseEntity.ok(guionService.forceUnlock(id));
    }

    // ==================== Gestión de Estado ====================

    @PutMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado del guion")
    public ResponseEntity<GuionResponse> cambiarEstado(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String nuevoEstado = body.get("estado");
        if (nuevoEstado == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Guion.EstadoGuion estado = Guion.EstadoGuion.valueOf(nuevoEstado);
            return ResponseEntity.ok(guionService.cambiarEstado(id, estado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ==================== Estadísticas ====================

    @GetMapping("/{id}/stats")
    @Operation(summary = "Obtener estadísticas del guion")
    public ResponseEntity<Map<String, Object>> getStats(@PathVariable String id) {
        GuionResponse guion = guionService.findById(id);
        return ResponseEntity.ok(Map.of(
                "id", id,
                "totalActos", guion.getTotalActos(),
                "totalTops", guion.getTotalTops(),
                "estado", guion.getEstado(),
                "locked", guion.isLocked()
        ));
    }
}
