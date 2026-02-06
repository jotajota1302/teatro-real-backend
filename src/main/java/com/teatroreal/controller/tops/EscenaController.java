package com.teatroreal.controller.tops;

import com.teatroreal.domain.tops.Escena;
import com.teatroreal.dto.request.EscenaRequest;
import com.teatroreal.service.tops.EscenaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/actos/{actoId}/escenas")
@RequiredArgsConstructor
public class EscenaController {

    private final EscenaService escenaService;

    @PostMapping
    public ResponseEntity<Escena> crearEscena(@PathVariable String actoId, @RequestBody EscenaRequest request) {
        Escena escena = escenaService.crearEscenaEnActo(actoId, request.getNombre(), request.getOrden());
        return ResponseEntity.status(201).body(escena);
    }

    @PutMapping("/{escenaId}")
    public ResponseEntity<Escena> updateEscena(
            @PathVariable String actoId,
            @PathVariable String escenaId,
            @RequestBody EscenaRequest request) {
        Escena escena = escenaService.updateEscena(escenaId, request.getNombre(), request.getDuracion());
        return ResponseEntity.ok(escena);
    }

    @DeleteMapping("/{escenaId}")
    public ResponseEntity<Void> deleteEscena(
            @PathVariable String actoId,
            @PathVariable String escenaId) {
        escenaService.deleteEscena(escenaId);
        return ResponseEntity.noContent().build();
    }
}
