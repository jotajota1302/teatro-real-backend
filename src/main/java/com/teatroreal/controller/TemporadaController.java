package com.teatroreal.controller;

import com.teatroreal.domain.tempo.Temporada;
import com.teatroreal.service.tempo.TemporadaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/temporadas")
@Tag(name = "Temporadas", description = "Gestión de temporadas")
public class TemporadaController {
    private final TemporadaService temporadaService;

    public TemporadaController(TemporadaService temporadaService) {
        this.temporadaService = temporadaService;
    }

    @GetMapping
    @Operation(summary = "Listar todas las temporadas")
    public ResponseEntity<List<Temporada>> findAll() {
        return ResponseEntity.ok(temporadaService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener temporada por ID")
    public ResponseEntity<Temporada> findById(@PathVariable Long id) {
        return ResponseEntity.ok(temporadaService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crear nueva temporada")
    public ResponseEntity<Temporada> create(@RequestBody Temporada temporada) {
        Temporada response = temporadaService.create(temporada);
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar temporada")
    public ResponseEntity<Temporada> update(@PathVariable Long id, @RequestBody Temporada temporada) {
        return ResponseEntity.ok(temporadaService.update(id, temporada));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar temporada")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        temporadaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/activar")
    @Operation(summary = "Activar temporada (marcar como actual)")
    public ResponseEntity<Temporada> activar(@PathVariable Long id) {
        return ResponseEntity.ok(temporadaService.activar(id));
    }
}
