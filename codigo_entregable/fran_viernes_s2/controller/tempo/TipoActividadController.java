package com.teatroreal.controller.tempo;

import com.teatroreal.domain.tempo.TipoActividad;
import com.teatroreal.dto.request.TipoActividadRequest;
import com.teatroreal.dto.response.TipoActividadResponse;
import com.teatroreal.service.tempo.TipoActividadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-actividad")
@RequiredArgsConstructor
public class TipoActividadController {

    private final TipoActividadService tipoActividadService;

    @GetMapping
    public ResponseEntity<List<TipoActividadResponse>> listar() {
        return ResponseEntity.ok(tipoActividadService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoActividadResponse> detalle(@PathVariable Long id) {
        return ResponseEntity.ok(tipoActividadService.detalle(id));
    }

    @PostMapping
    public ResponseEntity<TipoActividadResponse> crear(@RequestBody TipoActividadRequest request) {
        return ResponseEntity.status(201).body(tipoActividadService.crear(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoActividadResponse> actualizar(@PathVariable Long id, @RequestBody TipoActividadRequest request) {
        return ResponseEntity.ok(tipoActividadService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tipoActividadService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
