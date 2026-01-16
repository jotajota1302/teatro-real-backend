package com.teatroreal.controller.admin;

import com.teatroreal.domain.tempo.TipoActividad;
import com.teatroreal.repository.tempo.TipoActividadRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin/tipo-actividades")
@RequiredArgsConstructor
public class TipoActividadAdminController {

    private final TipoActividadRepository tipoActividadRepository;

    @Operation(summary = "Listar todos los tipos de actividad")
    @ApiResponse(responseCode = "200", description = "Tipos de actividad listados")
    @GetMapping
    public ResponseEntity<List<TipoActividad>> getAll() {
        return ResponseEntity.ok(tipoActividadRepository.findAll());
    }

    @Operation(summary = "Obtener tipo de actividad por ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Tipo de actividad encontrado"),
        @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<TipoActividad> getById(@PathVariable String id) {
        return ResponseEntity.ok(tipoActividadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("TipoActividad no encontrado")));
    }

    @Operation(summary = "Crear tipo de actividad")
    @ApiResponse(responseCode = "201", description = "Tipo de actividad creado")
    @PostMapping
    public ResponseEntity<TipoActividad> create(@Valid @RequestBody TipoActividad tipoActividad) {
        TipoActividad saved = tipoActividadRepository.save(tipoActividad);
        return ResponseEntity.status(201).body(saved);
    }

    @Operation(summary = "Actualizar tipo de actividad")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Tipo de actividad actualizado"),
        @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<TipoActividad> update(@PathVariable String id, @Valid @RequestBody TipoActividad tipoActividad) {
        if (!tipoActividadRepository.existsById(id))
            throw new EntityNotFoundException("TipoActividad no encontrado");
        tipoActividad.setId(id);
        TipoActividad updated = tipoActividadRepository.save(tipoActividad);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Eliminar tipo de actividad")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Eliminado correctamente"),
        @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        TipoActividad ta = tipoActividadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("TipoActividad no encontrado"));
        tipoActividadRepository.delete(ta);
        return ResponseEntity.noContent().build();
    }
}
