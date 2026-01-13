package com.teatroreal.controller;

import com.teatroreal.domain.tempo.Temporada;
import com.teatroreal.service.TemporadaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/temporadas")
@Tag(name = "Temporadas", description = "Gestión de temporadas")
public class TemporadaController {
    @Autowired
    private TemporadaService temporadaService;

    @GetMapping
    @Operation(summary = "Listar todas las temporadas")
    public List<Temporada> findAll() {
        return temporadaService.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener temporada por ID")
    public Temporada findById(@PathVariable Long id) {
        return temporadaService.findById(id);
    }

    @PostMapping
    @Operation(summary = "Crear nueva temporada")
    public Temporada create(@RequestBody Temporada t) {
        return temporadaService.create(t);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar temporada")
    public Temporada update(@PathVariable Long id, @RequestBody Temporada t) {
        return temporadaService.update(id, t);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar temporada")
    public void delete(@PathVariable Long id) {
        temporadaService.delete(id);
    }

    @PutMapping("/{id}/activar")
    @Operation(summary = "Activar temporada (marcar como actual)")
    public Temporada activar(@PathVariable Long id) {
        return temporadaService.activar(id);
    }
}
