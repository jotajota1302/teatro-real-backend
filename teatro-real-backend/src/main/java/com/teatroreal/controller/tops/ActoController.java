package com.teatroreal.controller.tops;

import com.teatroreal.domain.tops.Acto;
import com.teatroreal.dto.request.ActoRequest;
import com.teatroreal.dto.response.ActoResponse;
import com.teatroreal.service.tops.ActoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guiones/{guionId}/actos")
@RequiredArgsConstructor
@Tag(name = "Actos", description = "Gestión de actos dentro de guiones")
public class ActoController {

    private final ActoService actoService;

    @PostMapping
    @Operation(summary = "Crear nuevo acto en un guion")
    public ResponseEntity<ActoResponse> crearActo(
            @PathVariable String guionId,
            @RequestBody ActoRequest request) {
        ActoResponse acto = actoService.crearActoEnGuion(guionId, request.getNombre(), request.getOrden());
        return ResponseEntity.status(201).body(acto);
    }

    @PutMapping("/{actoId}")
    @Operation(summary = "Actualizar un acto")
    public ResponseEntity<ActoResponse> actualizarActo(
            @PathVariable String guionId,
            @PathVariable String actoId,
            @RequestBody ActoRequest request) {
        ActoResponse acto = actoService.actualizarActo(actoId, request.getNombre(), request.getOrden());
        return ResponseEntity.ok(acto);
    }

    @DeleteMapping("/{actoId}")
    @Operation(summary = "Eliminar un acto")
    public ResponseEntity<Void> eliminarActo(
            @PathVariable String guionId,
            @PathVariable String actoId) {
        actoService.eliminarActo(actoId);
        return ResponseEntity.noContent().build();
    }
}
