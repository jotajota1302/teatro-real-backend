package com.teatroreal.controller.admin;

import com.teatroreal.domain.tempo.TipoActividad;
import com.teatroreal.service.tempo.TipoActividadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin/tipos-actividad")
@RequiredArgsConstructor
public class TipoActividadAdminController {

    private final TipoActividadService tipoActividadService;

    @Operation(summary = "Listar todos los tipos de actividad (admin)")
    @ApiResponse(responseCode = "200", description = "Listado correcto")
    @GetMapping
    public ResponseEntity<List<TipoActividad>> findAll() {
        return ResponseEntity.ok(tipoActividadService.findAll());
    }

    @Operation(summary = "Obtener tipo de actividad por id (admin)")
    @ApiResponse(responseCode = "200", description = "Encontrado")
    @GetMapping("/{id}")
    public ResponseEntity<TipoActividad> findById(@PathVariable Long id) {
        return ResponseEntity.ok(tipoActividadService.findById(id));
    }

    @Operation(summary = "Crear tipo de actividad (admin)")
    @ApiResponse(responseCode = "201", description = "Creado")
    @PostMapping
    public ResponseEntity<TipoActividad> create(@Valid @RequestBody TipoActividad tipoActividad) {
        TipoActividad created = tipoActividadService.save(tipoActividad);
        return ResponseEntity.status(201).body(created);
    }

    @Operation(summary = "Actualizar tipo de actividad (admin)")
    @ApiResponse(responseCode = "200", description = "Actualizado")
    @PutMapping("/{id}")
    public ResponseEntity<TipoActividad> update(@PathVariable Long id, @Valid @RequestBody TipoActividad tipoActividad) {
        tipoActividad.setId(id);
        TipoActividad updated = tipoActividadService.save(tipoActividad);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Eliminar tipo de actividad (admin)")
    @ApiResponse(responseCode = "204", description = "Eliminado")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tipoActividadService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
