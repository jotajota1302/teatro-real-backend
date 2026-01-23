package com.teatroreal.tempo.presentation.controller;

import com.teatroreal.tempo.application.dto.ActividadDTO;
import com.teatroreal.tempo.application.dto.CreateActividadRequest;
import com.teatroreal.tempo.application.service.ActividadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tempo/actividades")
@Tag(name = "Actividades", description = "Gestión de actividades (funciones, ensayos, etc.)")
public class ActividadController {

    private final ActividadService actividadService;

    public ActividadController(ActividadService actividadService) {
        this.actividadService = actividadService;
    }

    @PostMapping
    @Operation(summary = "Crear una nueva actividad")
    public ResponseEntity<ActividadDTO> crearActividad(@RequestBody CreateActividadRequest request) {
        ActividadDTO actividadDTO = actividadService.crearActividad(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(actividadDTO);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una actividad por ID")
    public ResponseEntity<ActividadDTO> obtenerActividad(@PathVariable String id) {
        ActividadDTO actividadDTO = actividadService.obtenerActividad(id);
        return ResponseEntity.ok(actividadDTO);
    }

    @GetMapping
    @Operation(summary = "Listar todas las actividades")
    public ResponseEntity<List<ActividadDTO>> listarActividades() {
        List<ActividadDTO> actividades = actividadService.listarActividades();
        return ResponseEntity.ok(actividades);
    }

    @GetMapping("/espacio/{espacioId}")
    @Operation(summary = "Listar actividades por espacio")
    public ResponseEntity<List<ActividadDTO>> listarActividadesPorEspacio(@PathVariable String espacioId) {
        List<ActividadDTO> actividades = actividadService.listarActividadesPorEspacio(espacioId);
        return ResponseEntity.ok(actividades);
    }

    @GetMapping("/responsable/{responsable}")
    @Operation(summary = "Listar actividades por responsable")
    public ResponseEntity<List<ActividadDTO>> listarActividadesPorResponsable(@PathVariable String responsable) {
        List<ActividadDTO> actividades = actividadService.listarActividadesPorResponsable(responsable);
        return ResponseEntity.ok(actividades);
    }

    @GetMapping("/rango")
    @Operation(summary = "Listar actividades por rango de fechas")
    public ResponseEntity<List<ActividadDTO>> listarActividadesPorRango(
            @RequestParam String inicio, @RequestParam String fin) {
        List<ActividadDTO> actividades = actividadService.listarActividadesPorRango(inicio, fin);
        return ResponseEntity.ok(actividades);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una actividad")
    public ResponseEntity<ActividadDTO> actualizarActividad(
            @PathVariable String id,
            @RequestBody CreateActividadRequest request) {
        ActividadDTO actividadDTO = actividadService.actualizarActividad(id, request);
        return ResponseEntity.ok(actividadDTO);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una actividad")
    public ResponseEntity<Void> eliminarActividad(@PathVariable String id) {
        actividadService.eliminarActividad(id);
        return ResponseEntity.noContent().build();
    }
}
