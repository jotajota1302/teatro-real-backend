package com.teatroreal.controller.tempo;

import com.teatroreal.dto.request.ActividadRequest;
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

    @Operation(summary = "Obtener actividades filtradas por espacio, tipo, temporada o fechas")
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
            @RequestParam String fecha // Formato ISO-8601 yyyy-MM-dd
    ) {
        ActividadResponse cloned = actividadService.cloneActividad(id, fecha);
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
            @RequestParam String nuevoEstado
    ) {
        ActividadResponse changed = actividadService.changeStatus(id, nuevoEstado);
        return ResponseEntity.ok(changed);
    }
}
