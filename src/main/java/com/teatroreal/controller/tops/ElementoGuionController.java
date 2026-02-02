package com.teatroreal.controller.tops;

import com.teatroreal.domain.tops.ElementoGuion;
import com.teatroreal.dto.request.ElementoGuionRequest;
import com.teatroreal.service.tops.ElementoGuionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/escenas/{escenaId}/elementos")
@RequiredArgsConstructor
public class ElementoGuionController {

    private final ElementoGuionService elementoGuionService;

    @PostMapping
    public ResponseEntity<ElementoGuion> crearElemento(@PathVariable String escenaId, @RequestBody ElementoGuionRequest request) {
        ElementoGuion elemento = elementoGuionService.crearElementoEnEscena(
            escenaId,
            request.getTexto(),
            request.getTipoElemento(),
            request.getOrden(),
            request.getColorHex()
        );
        return ResponseEntity.status(201).body(elemento);
    }

    @DeleteMapping("/{elementoId}")
    public ResponseEntity<Void> eliminarElemento(@PathVariable String escenaId, @PathVariable String elementoId) {
        elementoGuionService.eliminarElemento(escenaId, elementoId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{elementoId}")
    public ResponseEntity<ElementoGuion> actualizarElemento(
            @PathVariable String escenaId,
            @PathVariable String elementoId,
            @RequestBody ElementoGuionRequest request) {
        ElementoGuion elemento = elementoGuionService.actualizarElemento(
            escenaId,
            elementoId,
            request.getTexto(),
            request.getTipoElemento(),
            request.getOrden(),
            request.getColorHex()
        );
        return ResponseEntity.ok(elemento);
    }
}
