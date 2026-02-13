package com.teatroreal.controller.tops;

import com.teatroreal.domain.tops.Guion;
import com.teatroreal.dto.request.GuionRequest;
import com.teatroreal.dto.response.GuionResponse;
import com.teatroreal.dto.response.GuionCompletoResponse;
import com.teatroreal.dto.response.GuionVistaResponse;
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

import com.teatroreal.service.tops.ExportWordService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/guiones")
@Tag(name = "Guiones", description = "Gestión de guiones técnicos - TOPS")
public class GuionController {

    @Autowired
    private GuionService guionService;

    @Autowired
    private ExportWordService exportWordService;

    @GetMapping
    @Operation(summary = "Listar todos los guiones")
    public ResponseEntity<List<GuionResponse>> findAll(
            @RequestParam(required = false) String temporada,
            @RequestParam(required = false) String titulo) {
        return ResponseEntity.ok(guionService.findByFilters(temporada, titulo));
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
            @Valid @RequestBody GuionRequest request,
            Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(guionService.update(id, request, userId));
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

    // ==================== Vistas read-only (Sprint D) ====================

    @GetMapping("/{id}/vista/global")
    @Operation(summary = "Vista global read-only del guion (lista TOPs optimizada)")
    public ResponseEntity<GuionVistaResponse> getVistaGlobal(@PathVariable String id) {
        return ResponseEntity.ok(guionService.getVistaGlobal(id));
    }

    @GetMapping("/{id}/vista/tops")
    @Operation(summary = "Vista TOPs por departamento (query param 'departamento')")
    public ResponseEntity<GuionVistaResponse> getVistaTops(@PathVariable String id,
                                                          @RequestParam(required = false) String departamento) {
        return ResponseEntity.ok(guionService.getVistaTops(id, departamento));
    }

    // ==================== Export Word ====================

    @GetMapping("/{id}/export")
    @Operation(summary = "Exportar guion a Word (.docx)")
    public ResponseEntity<byte[]> exportToWord(@PathVariable String id) {
        try {
            byte[] docxBytes = exportWordService.exportToWord(id);

            GuionResponse guion = guionService.findById(id);
            String filename = "guion_" + sanitizeFilename(guion.getProduccionNombre()) + "_" + id + ".docx";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"));
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(docxBytes.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(docxBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private String sanitizeFilename(String name) {
        if (name == null) return "guion";
        return name.replaceAll("[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s-]", "")
                   .replaceAll("\\s+", "_")
                   .toLowerCase();
    }
}
