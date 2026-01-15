package com.teatroreal.controller.tempo;

import com.teatroreal.domain.tempo.Actividad;
import com.teatroreal.service.tempo.ActividadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/actividades")
@RequiredArgsConstructor
public class ActividadController {

    private final ActividadService service;

    @Operation(summary = "Listar todas las actividades")
    @ApiResponse(responseCode = "200", description = "Listado correcto")
    @GetMapping
    public ResponseEntity<List<Actividad>> findAll() {
        return ResponseEntity.ok(service.findAll());
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
}
