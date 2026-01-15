package com.teatroreal.controller.admin;

import com.teatroreal.domain.tempo.Espacio;
import com.teatroreal.service.DepartamentoService;
import com.teatroreal.service.TemporadaService;
import com.teatroreal.service.tempo.EspacioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin/espacios")
@RequiredArgsConstructor
public class EspacioAdminController {

    private final EspacioService espacioService;

    @Operation(summary = "Listar todos los espacios (admin)")
    @ApiResponse(responseCode = "200", description = "Listado correcto")
    @GetMapping
    public ResponseEntity<List<Espacio>> findAll() {
        return ResponseEntity.ok(espacioService.findAll());
    }

    @Operation(summary = "Obtener espacio por id (admin)")
    @ApiResponse(responseCode = "200", description = "Encontrado")
    @GetMapping("/{id}")
    public ResponseEntity<Espacio> findById(@PathVariable Long id) {
        return ResponseEntity.ok(espacioService.findById(id));
    }

    @Operation(summary = "Crear espacio (admin)")
    @ApiResponse(responseCode = "201", description = "Creado")
    @PostMapping
    public ResponseEntity<Espacio> create(@Valid @RequestBody Espacio espacio) {
        Espacio created = espacioService.save(espacio);
        return ResponseEntity.status(201).body(created);
    }

    @Operation(summary = "Actualizar espacio (admin)")
    @ApiResponse(responseCode = "200", description = "Actualizado")
    @PutMapping("/{id}")
    public ResponseEntity<Espacio> update(@PathVariable Long id, @Valid @RequestBody Espacio espacio) {
        espacio.setId(id);
        Espacio updated = espacioService.save(espacio);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Eliminar espacio (admin)")
    @ApiResponse(responseCode = "204", description = "Eliminado")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        espacioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
