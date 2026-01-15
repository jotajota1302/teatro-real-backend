package com.teatroreal.controller.tempo;

import com.teatroreal.domain.tempo.Actividad;
import com.teatroreal.domain.tempo.EstadoActividad;
import com.teatroreal.service.tempo.ActividadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/actividades")
@RequiredArgsConstructor
public class ActividadController {

    private final ActividadService service;

    @Operation(summary = "Listar todas las actividades")
    @ApiResponse(responseCode = "200", description = "Listado correcto")
    @GetMapping
    public ResponseEntity<List<Actividad>> findAll(
            @RequestParam(required = false) Long espacioId,
            @RequestParam(required = false) Long tipoActividadId,
            @RequestParam(required = false) String temporada,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha
    ) {
        // Filtro combinado SÓLO si algún filtro viene, sino todo
        if (espacioId != null || tipoActividadId != null || temporada != null || fecha != null) {
            return ResponseEntity.ok(service.findByCriteria(espacioId, tipoActividadId, temporada, fecha));
        } else {
            return ResponseEntity.ok(service.findAll());
        }
    }

    @Operation(summary = "Buscar actividad por id")
    @ApiResponse(responseCode = "200", description = "Encontrada")
    @GetMapping("/{id}")
    public ResponseEntity<Actividad> findById(@PathVariable String id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @Operation(summary = "Crear actividad")
    @ApiResponse(responseCode = "201", description = "Creada")
    @PostMapping
    public ResponseEntity<Actividad> create(@Valid @RequestBody Actividad actividad) {
        Actividad created = service.save(actividad);
        return ResponseEntity.status(201).body(created);
    }

    @Operation(summary = "Actualizar actividad")
    @ApiResponse(responseCode = "200", description = "Actualizada")
    @PutMapping("/{id}")
    public ResponseEntity<Actividad> update(@PathVariable String id, @Valid @RequestBody Actividad actividad) {
        actividad.setId(id);
        Actividad updated = service.save(actividad);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Eliminar actividad")
    @ApiResponse(responseCode = "204", description = "Eliminada")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Nuevo endpoint: clonar
    @Operation(summary = "Clonar actividad en otra fecha")
    @ApiResponse(responseCode = "201", description = "Clonada")
    @PostMapping("/{id}/clone")
    public ResponseEntity<Actividad> clone(
            @PathVariable String id,
            @RequestBody CloneActividadRequest request
    ) {
        Actividad clonada = service.clonarActividad(id, request.getFecha());
        return ResponseEntity.status(201).body(clonada);
    }

    // Nuevo endpoint: actualizar estado almacén
    @Operation(summary = "Actualizar estado almacén de una actividad")
    @ApiResponse(responseCode = "200", description = "Estado actualizado")
    @PutMapping("/{id}/status")
    public ResponseEntity<Actividad> updateStatus(
            @PathVariable String id,
            @RequestBody UpdateEstadoRequest request
    ) {
        Actividad updated = service.actualizarEstado(id, request.getEstado());
        return ResponseEntity.ok(updated);
    }

    // DTOs internos
    @Data
    public static class CloneActividadRequest {
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        private LocalDate fecha;
    }
    @Data
    public static class UpdateEstadoRequest {
        private EstadoActividad estado;
    }
}
