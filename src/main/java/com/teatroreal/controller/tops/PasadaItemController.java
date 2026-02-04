package com.teatroreal.controller.tops;

import com.teatroreal.domain.tops.PasadaItem;
import com.teatroreal.dto.request.PasadaItemRequest;
import com.teatroreal.service.tops.PasadaItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/actos/{actoId}/pasada")
@Tag(name = "Pasada Items", description = "Gestión de items de pasada de actos - TOPS")
public class PasadaItemController {

    @Autowired
    private PasadaItemService pasadaItemService;

    @GetMapping
    @Operation(summary = "Listar items de pasada de un acto")
    public ResponseEntity<List<PasadaItem>> findByActo(@PathVariable String actoId) {
        return ResponseEntity.ok(pasadaItemService.findByActoId(actoId));
    }

    @PostMapping
    @Operation(summary = "Crear item de pasada")
    public ResponseEntity<PasadaItem> create(
            @PathVariable String actoId,
            @RequestBody PasadaItemRequest request) {
        PasadaItem created = pasadaItemService.create(actoId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/insert")
    @Operation(summary = "Insertar item de pasada en posición específica")
    public ResponseEntity<PasadaItem> insertAt(
            @PathVariable String actoId,
            @RequestParam int orden,
            @RequestBody PasadaItemRequest request) {
        PasadaItem created = pasadaItemService.insertAt(actoId, orden, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar item de pasada")
    public ResponseEntity<PasadaItem> update(
            @PathVariable String actoId,
            @PathVariable String id,
            @RequestBody PasadaItemRequest request) {
        return ResponseEntity.ok(pasadaItemService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar item de pasada")
    public ResponseEntity<Void> delete(
            @PathVariable String actoId,
            @PathVariable String id) {
        pasadaItemService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reorder")
    @Operation(summary = "Reordenar items de pasada")
    public ResponseEntity<Void> reorder(
            @PathVariable String actoId,
            @RequestBody List<String> orderedIds) {
        pasadaItemService.reorder(actoId, orderedIds);
        return ResponseEntity.noContent().build();
    }
}
