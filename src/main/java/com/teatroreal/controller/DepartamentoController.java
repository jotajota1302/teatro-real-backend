package com.teatroreal.controller;

import com.teatroreal.domain.tempo.Departamento;
import com.teatroreal.service.tempo.DepartamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/departamentos")
@Tag(name = "Departamentos", description = "Gestión de departamentos")
public class DepartamentoController {
    @Autowired
    private DepartamentoService departamentoService;

    @GetMapping
    @Operation(summary = "Listar todos los departamentos")
    public List<Departamento> findAll() {
        return departamentoService.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener departamento por ID")
    public Departamento findById(@PathVariable Long id) {
        return departamentoService.findById(id);
    }

    @PostMapping
    @Operation(summary = "Crear nuevo departamento")
    public Departamento create(@RequestBody Departamento d) {
        return departamentoService.create(d);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar departamento")
    public Departamento update(@PathVariable Long id, @RequestBody Departamento d) {
        return departamentoService.update(id, d);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar departamento")
    public void delete(@PathVariable Long id) {
        departamentoService.delete(id);
    }

    @PutMapping("/{id}/personal")
    @Operation(summary = "Asignar jefe y personal")
    public Departamento setJefeYPersonal(@PathVariable Long id,
                                         @RequestParam(required = false) String jefeId,
                                         @RequestBody(required = false) Set<String> personalIds) {
        return departamentoService.setJefeYPersonal(id, jefeId, personalIds);
    }
}
