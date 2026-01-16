package com.teatroreal.controller.tops;

import com.teatroreal.domain.tops.Acto;
import com.teatroreal.dto.request.ActoRequest;
import com.teatroreal.service.tops.ActoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guiones/{guionId}/actos")
@RequiredArgsConstructor
public class ActoController {

    private final ActoService actoService;

    @PostMapping
    public ResponseEntity<Acto> crearActo(@PathVariable String guionId, @RequestBody ActoRequest request) {
        Acto acto = actoService.crearActoEnGuion(guionId, request.getNombre(), request.getOrden());
        return ResponseEntity.status(201).body(acto);
    }

    // Otros endpoints según necesidad (GET, PUT, DELETE)...
}
