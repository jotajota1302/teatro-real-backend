package com.teatroreal.controller.tempo;

import com.teatroreal.domain.tempo.Espacio;
import com.teatroreal.dto.request.EspacioRequest;
import com.teatroreal.dto.response.EspacioResponse;
import com.teatroreal.service.tempo.EspacioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/espacios")
@RequiredArgsConstructor
public class EspacioController {

    private final EspacioService espacioService;

    @GetMapping
    public ResponseEntity<List<EspacioResponse>> listar() {
        return ResponseEntity.ok(espacioService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EspacioResponse> detalle(@PathVariable Long id) {
        return ResponseEntity.ok(espacioService.detalle(id));
    }

    @PostMapping
    public ResponseEntity<EspacioResponse> crear(@RequestBody EspacioRequest request) {
        return ResponseEntity.status(201).body(espacioService.crear(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EspacioResponse> actualizar(@PathVariable Long id, @RequestBody EspacioRequest request) {
        return ResponseEntity.ok(espacioService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        espacioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
