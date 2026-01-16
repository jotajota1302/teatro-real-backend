package com.teatroreal.controller.admin;

import com.teatroreal.domain.tempo.Espacio;
import com.teatroreal.repository.tempo.EspacioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

<<<<<<< HEAD
import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
=======
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
>>>>>>> 5f5ad938ebc041f2e716139a5623612b8f844e98
import java.util.List;

@RestController
@RequestMapping("/api/admin/espacios")
@RequiredArgsConstructor
public class EspacioAdminController {

    private final EspacioRepository espacioRepository;

    @Operation(summary = "Listar todos los espacios")
    @ApiResponse(responseCode = "200", description = "Espacios listados")
    @GetMapping
    public ResponseEntity<List<Espacio>> getAll() {
        return ResponseEntity.ok(espacioRepository.findAll());
    }

    @Operation(summary = "Obtener un espacio por ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Espacio encontrado"),
        @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    @GetMapping("/{id}")
<<<<<<< HEAD
    public ResponseEntity<Espacio> getById(@PathVariable String id) {
=======
    public ResponseEntity<Espacio> getById(@PathVariable Long id) {
>>>>>>> 5f5ad938ebc041f2e716139a5623612b8f844e98
        return ResponseEntity.ok(espacioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Espacio no encontrado")));
    }

    @Operation(summary = "Crear nuevo espacio")
    @ApiResponse(responseCode = "201", description = "Espacio creado")
    @PostMapping
    public ResponseEntity<Espacio> create(@Valid @RequestBody Espacio espacio) {
        Espacio saved = espacioRepository.save(espacio);
        return ResponseEntity.status(201).body(saved);
    }

    @Operation(summary = "Actualizar espacio")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Espacio actualizado"),
        @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    @PutMapping("/{id}")
<<<<<<< HEAD
    public ResponseEntity<Espacio> update(@PathVariable String id, @Valid @RequestBody Espacio espacio) {
        if (!espacioRepository.existsById(id))
            throw new EntityNotFoundException("Espacio no encontrado");
        espacio.setId(Long.valueOf(id));
=======
    public ResponseEntity<Espacio> update(@PathVariable Long id, @Valid @RequestBody Espacio espacio) {
        if (!espacioRepository.existsById(id))
            throw new EntityNotFoundException("Espacio no encontrado");
        espacio.setId(id);
>>>>>>> 5f5ad938ebc041f2e716139a5623612b8f844e98
        Espacio updated = espacioRepository.save(espacio);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Eliminar espacio")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Eliminado correctamente"),
        @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    @DeleteMapping("/{id}")
<<<<<<< HEAD
    public ResponseEntity<Void> delete(@PathVariable String id) {
=======
    public ResponseEntity<Void> delete(@PathVariable Long id) {
>>>>>>> 5f5ad938ebc041f2e716139a5623612b8f844e98
        Espacio espacio = espacioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Espacio no encontrado"));
        espacioRepository.delete(espacio);
        return ResponseEntity.noContent().build();
    }
}
