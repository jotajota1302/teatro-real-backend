package com.teatroreal.controller.tempo;

import com.teatroreal.dto.request.TipoActividadRequest;
import com.teatroreal.dto.response.TipoActividadResponse;
import com.teatroreal.service.tempo.TipoActividadService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/tipo-actividades")
@RequiredArgsConstructor
public class TipoActividadController {

    private final TipoActividadService tipoActividadService;

    @Operation(summary = "Obtener todos los tipos de actividad")
    @ApiResponse(responseCode = "200", description = "Tipos de actividad listados")
    @GetMapping
    public ResponseEntity<List<TipoActividadResponse>> getAll() {
        return ResponseEntity.ok(tipoActividadService.getAll());
    }

    @Operation(summary = "Obtener un tipo de actividad por ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Tipo de actividad encontrado"),
        @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<TipoActividadResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(tipoActividadService.getById(id));
    }

    @Operation(summary = "Crear un nuevo tipo de actividad")
    @ApiResponse(responseCode = "201", description = "Tipo de actividad creado")
    @PostMapping
    public ResponseEntity<TipoActividadResponse> create(@Valid @RequestBody TipoActividadRequest request) {
        TipoActividadResponse created = tipoActividadService.create(request);
        return ResponseEntity.status(201).body(created);
    }

    @Operation(summary = "Actualizar un tipo de actividad existente")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Tipo de actividad actualizado"),
        @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<TipoActividadResponse> update(@PathVariable String id, @Valid @RequestBody TipoActividadRequest request) {
        TipoActividadResponse updated = tipoActividadService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Eliminar un tipo de actividad")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Eliminado correctamente"),
        @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        tipoActividadService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
