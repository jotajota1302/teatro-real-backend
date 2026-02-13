package com.teatroreal.controller.tempo;

import com.teatroreal.dto.request.OperacionLogisticaRequest;
import com.teatroreal.dto.response.ActividadResponse;
import com.teatroreal.dto.response.LogisticaSummaryResponse;
import com.teatroreal.service.tempo.LogisticaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/logistica")
@RequiredArgsConstructor
@Tag(name = "Logística", description = "Gestión de operaciones logísticas en almacenes (TEMPO)")
public class LogisticaController {

    private final LogisticaService logisticaService;

    @Operation(summary = "Obtener resumen/estadísticas de logística")
    @ApiResponse(responseCode = "200", description = "Resumen de operaciones")
    @GetMapping("/summary")
    public ResponseEntity<LogisticaSummaryResponse> getSummary() {
        return ResponseEntity.ok(logisticaService.getSummary());
    }

    @Operation(summary = "Listar todas las operaciones de almacén")
    @ApiResponse(responseCode = "200", description = "Lista de operaciones")
    @GetMapping("/operaciones")
    public ResponseEntity<List<ActividadResponse>> getOperaciones() {
        return ResponseEntity.ok(logisticaService.getOperaciones());
    }

    @Operation(summary = "Listar operaciones de almacén por rango de fechas (para calendario)")
    @ApiResponse(responseCode = "200", description = "Lista de operaciones en rango")
    @GetMapping("/calendario")
    public ResponseEntity<List<ActividadResponse>> getCalendario(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin
    ) {
        return ResponseEntity.ok(logisticaService.getOperacionesByFechas(inicio, fin));
    }

    @Operation(summary = "Listar operaciones por temporada")
    @ApiResponse(responseCode = "200", description = "Lista de operaciones de la temporada")
    @GetMapping("/temporada/{temporadaId}")
    public ResponseEntity<List<ActividadResponse>> getByTemporada(@PathVariable Long temporadaId) {
        return ResponseEntity.ok(logisticaService.getOperacionesByTemporada(temporadaId));
    }

    @Operation(summary = "Obtener una operación por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Operación encontrada"),
            @ApiResponse(responseCode = "404", description = "Operación no encontrada"),
            @ApiResponse(responseCode = "400", description = "No es una operación de almacén")
    })
    @GetMapping("/operaciones/{id}")
    public ResponseEntity<ActividadResponse> getOperacionById(@PathVariable String id) {
        return ResponseEntity.ok(logisticaService.getOperacionById(id));
    }

    @Operation(summary = "Iniciar tránsito: PENDIENTE → EN_TRANSITO")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tránsito iniciado"),
            @ApiResponse(responseCode = "404", description = "Operación no encontrada"),
            @ApiResponse(responseCode = "400", description = "Transición de estado inválida")
    })
    @PutMapping("/operaciones/{id}/iniciar-transito")
    public ResponseEntity<ActividadResponse> iniciarTransito(@PathVariable String id) {
        return ResponseEntity.ok(logisticaService.iniciarTransito(id));
    }

    @Operation(summary = "Completar operación: EN_TRANSITO → COMPLETADO")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Operación completada"),
            @ApiResponse(responseCode = "404", description = "Operación no encontrada"),
            @ApiResponse(responseCode = "400", description = "Transición de estado inválida")
    })
    @PutMapping("/operaciones/{id}/completar")
    public ResponseEntity<ActividadResponse> completar(@PathVariable String id) {
        return ResponseEntity.ok(logisticaService.completar(id));
    }

    @Operation(summary = "Reiniciar operación a PENDIENTE (deshacer)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Operación reiniciada"),
            @ApiResponse(responseCode = "404", description = "Operación no encontrada")
    })
    @PutMapping("/operaciones/{id}/reiniciar")
    public ResponseEntity<ActividadResponse> reiniciar(@PathVariable String id) {
        return ResponseEntity.ok(logisticaService.reiniciar(id));
    }

    @Operation(summary = "Listar almacenes disponibles")
    @ApiResponse(responseCode = "200", description = "Lista de almacenes")
    @GetMapping("/almacenes")
    public ResponseEntity<List<Map<String, Object>>> getAlmacenes() {
        return ResponseEntity.ok(logisticaService.getAlmacenes());
    }

    @Operation(summary = "Crear nueva operación logística")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Operación creada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Almacén o temporada no encontrada")
    })
    @PostMapping("/operaciones")
    public ResponseEntity<ActividadResponse> crear(@Valid @RequestBody OperacionLogisticaRequest request) {
        ActividadResponse response = logisticaService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Actualizar operación logística existente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Operación actualizada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o no es operación de almacén"),
            @ApiResponse(responseCode = "404", description = "Operación no encontrada")
    })
    @PutMapping("/operaciones/{id}")
    public ResponseEntity<ActividadResponse> actualizar(
            @PathVariable String id,
            @Valid @RequestBody OperacionLogisticaRequest request) {
        return ResponseEntity.ok(logisticaService.actualizar(id, request));
    }

    @Operation(summary = "Eliminar operación logística")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Operación eliminada"),
            @ApiResponse(responseCode = "400", description = "No es operación de almacén"),
            @ApiResponse(responseCode = "404", description = "Operación no encontrada")
    })
    @DeleteMapping("/operaciones/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        logisticaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
