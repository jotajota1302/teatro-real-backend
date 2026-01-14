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

import javax.validation.Valid;
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
}
