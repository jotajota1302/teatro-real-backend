package com.teatroreal.controller.tempo;

import com.teatroreal.dto.request.ActividadRequest;
import com.teatroreal.dto.request.ActividadFiltrosRequest;
import com.teatroreal.dto.request.CloneActividadRequest;
import com.teatroreal.dto.request.StatusActividadRequest;
import com.teatroreal.dto.response.ActividadResponse;
import com.teatroreal.service.tempo.ActividadService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/actividades")
@RequiredArgsConstructor
public class ActividadController {

    private final ActividadService actividadService;

    @Operation(summary = "Obtener todas las actividades")
    @ApiResponse(responseCode = "200", description = "Actividades listadas")
    @GetMapping
    public ResponseEntity<List<ActividadResponse>> getAll() {
        return ResponseEntity.ok(actividadService.getAll());
    }

    @Operation(summary = "Obtener actividades filtradas por espacio, tipo, temporada o fechas (simple)")
    @ApiResponse(responseCode = "200", description = "Actividades filtradas listadas")
    @GetMapping("/search")
    public ResponseEntity<List<ActividadResponse>> search(
            @RequestParam(required = false) String espacioId,
            @RequestParam(required = false) String tipoActividadId,
            @RequestParam(required = false) String temporadaId,
            @RequestParam(required = false) String fechaInicio,
            @RequestParam(required = false) String fechaFin
    ) {
        return ResponseEntity.ok(
            actividadService.search(espacioId, tipoActividadId, temporadaId, fechaInicio, fechaFin)
        );
    }

    @Operation(summary = "Búsqueda avanzada con múltiples filtros combinados")
    @ApiResponse(responseCode = "200", description = "Actividades filtradas con criterios avanzados")
    @PostMapping("/search/advanced")
    public ResponseEntity<List<ActividadResponse>> searchAdvanced(
            @Valid @RequestBody ActividadFiltrosRequest filtros
    ) {
        return ResponseEntity.ok(actividadService.searchConFiltros(filtros));
    }

    @Operation(summary = "Obtener una actividad por ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Actividad encontrada"),
        @ApiResponse(responseCode = "404", description = "No encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ActividadResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(actividadService.getById(id));
    }

    @Operation(summary = "Crear una nueva actividad")
    @ApiResponse(responseCode = "201", description = "Actividad creada")
    @PostMapping
    public ResponseEntity<ActividadResponse> create(@Valid @RequestBody ActividadRequest request) {
        ActividadResponse created = actividadService.create(request);
        return ResponseEntity.status(201).body(created);
    }

    @Operation(summary = "Actualizar una actividad existente")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Actividad actualizada"),
        @ApiResponse(responseCode = "404", description = "No encontrada")
    })
    @PutMapping("/{id}")
    public ResponseEntity<ActividadResponse> update(@PathVariable String id, @Valid @RequestBody ActividadRequest request) {
        ActividadResponse updated = actividadService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Eliminar una actividad")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Eliminada correctamente"),
        @ApiResponse(responseCode = "404", description = "No encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        actividadService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Clonar una actividad a nueva fecha")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Actividad clonada"),
        @ApiResponse(responseCode = "404", description = "No encontrada")
    })
    @PostMapping("/{id}/clone")
    public ResponseEntity<ActividadResponse> cloneActividad(
            @PathVariable String id,
            @Valid @RequestBody CloneActividadRequest request
    ) {
        ActividadResponse cloned = actividadService.cloneActividad(id, request.getNuevaFecha());
        return ResponseEntity.status(201).body(cloned);
    }

    @Operation(summary = "Cambiar el estado de una actividad (máquina de estados)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Estado actualizado"),
        @ApiResponse(responseCode = "404", description = "No encontrada"),
        @ApiResponse(responseCode = "400", description = "Transición de estado inválida")
    })
    @PutMapping("/{id}/status")
    public ResponseEntity<ActividadResponse> changeStatus(
            @PathVariable String id,
            @Valid @RequestBody StatusActividadRequest request
    ) {
        ActividadResponse changed = actividadService.changeStatus(id, request.getEstado());
        return ResponseEntity.ok(changed);
    }
}
