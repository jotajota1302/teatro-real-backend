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

    // Otros endpoints según necesidad...
}
