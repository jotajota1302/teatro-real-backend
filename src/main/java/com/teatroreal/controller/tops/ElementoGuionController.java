package com.teatroreal.controller.tops;

import com.teatroreal.dto.request.ElementoGuionRequest;
import com.teatroreal.dto.response.ElementoGuionResponse;
import com.teatroreal.service.tops.ElementoGuionService;
import com.teatroreal.service.tops.ValidacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para ElementoGuion (TOP, Entrada, Mutis, etc.)
 * Endpoints para crear, actualizar, eliminar elementos de guiones
 */
@RestController
@RequestMapping("/api/tops/elementos")
@RequiredArgsConstructor
public class ElementoGuionController {

    private final ElementoGuionService elementoGuionService;
    private final ValidacionService validacionService;

    /**
     * GET /api/tops/elementos/{id}
     * Obtiene un elemento por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ElementoGuionResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(elementoGuionService.findById(id));
    }

    /**
     * GET /api/tops/elementos/escena/{escenaId}
     * Obtiene todos los elementos de una escena (ordenados)
     */
    @GetMapping("/escena/{escenaId}")
    public ResponseEntity<List<ElementoGuionResponse>> getByEscena(@PathVariable String escenaId) {
        return ResponseEntity.ok(elementoGuionService.findByEscenaId(escenaId));
    }

    /**
     * GET /api/tops/elementos/guion/{guionId}
     * Obtiene todos los elementos de un guion (ordenados)
     */
    @GetMapping("/guion/{guionId}")
    public ResponseEntity<List<ElementoGuionResponse>> getByGuion(@PathVariable String guionId) {
        return ResponseEntity.ok(elementoGuionService.findByGuionId(guionId));
    }

    /**
     * POST /api/tops/elementos
     * Crea un nuevo elemento con validaciones
     */
    @PostMapping
    public ResponseEntity<ElementoGuionResponse> create(
            @RequestBody ElementoGuionRequest request,
            @RequestParam String escenaId,
            @RequestParam String guionId,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String userEmail) {

        // Las validaciones ahora se hacen en el servicio
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(elementoGuionService.create(request, escenaId, guionId, userId, userEmail));
    }

    /**
     * PUT /api/tops/elementos/{id}
     * Actualiza un elemento existente (soporta updates parciales)
     */
    @PutMapping("/{id}")
    public ResponseEntity<ElementoGuionResponse> update(
            @PathVariable String id,
            @RequestBody ElementoGuionRequest request) {

        // Validar PIE si está presente (todos los componentes deben existir)
        if (request.getRefPagina() != null && request.getRefCompas() != null && request.getRefTimecode() != null) {
            String pieFormato = request.getPieFormateado();
            if (pieFormato != null) {
                validacionService.validarPIE(pieFormato);
            }
        }

        // Validar TOP E/M si está presente
        if (request.getNumeroTop() != null && !request.getNumeroTop().isEmpty()) {
            validacionService.validarTopEM(request.getNumeroTop());
        }

        // Validar departamento si está presente
        if (request.getDepartamento() != null && !request.getDepartamento().isEmpty()) {
            validacionService.validarDepartamento(request.getDepartamento());
        }

        // Validar encabezado obligatorio solo si se envía tipoElemento
        if (request.getTipoElemento() != null && request.getEncabezado() != null) {
            validacionService.validarEncabezadoObligatorio(request.getEncabezado(), request.getTipoElemento().toString());
        }

        return ResponseEntity.ok(elementoGuionService.update(id, request));
    }

    /**
     * DELETE /api/tops/elementos/{id}
     * Elimina un elemento
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        elementoGuionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/tops/elementos/escena/{escenaId}/reorder
     * Reordena elementos dentro de una escena
     *
     * @param escenaId ID de la escena
     * @param elementIds Lista ordenada de IDs de elementos
     */
    @PostMapping("/escena/{escenaId}/reorder")
    public ResponseEntity<Void> reorder(
            @PathVariable String escenaId,
            @RequestBody List<String> elementIds) {
        elementoGuionService.reorderElements(escenaId, elementIds);
        return ResponseEntity.noContent().build();
    }
}
