package com.teatroreal.controller;

import com.teatroreal.dto.request.DepartamentoRequest;
import com.teatroreal.dto.response.DepartamentoResponse;
import com.teatroreal.service.tempo.DepartamentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<DepartamentoResponse>> findAll() {
        return ResponseEntity.ok(departamentoService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener departamento por ID")
    public ResponseEntity<DepartamentoResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(departamentoService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crear nuevo departamento")
    public ResponseEntity<DepartamentoResponse> create(@Valid @RequestBody DepartamentoRequest request) {
        DepartamentoResponse response = departamentoService.create(request);
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar departamento")
    public ResponseEntity<DepartamentoResponse> update(@PathVariable Long id, @Valid @RequestBody DepartamentoRequest request) {
        return ResponseEntity.ok(departamentoService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar departamento")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        departamentoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/personal")
    @Operation(summary = "Asignar jefe y personal")
    public ResponseEntity<DepartamentoResponse> setJefeYPersonal(@PathVariable Long id,
                                                                 @RequestParam(required = false) String jefeId,
                                                                 @RequestBody(required = false) Set<String> personalIds) {
        return ResponseEntity.ok(departamentoService.setJefeYPersonal(id, jefeId, personalIds));
    }
}
