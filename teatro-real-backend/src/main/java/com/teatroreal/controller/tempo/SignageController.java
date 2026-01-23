package com.teatroreal.controller.tempo;

import com.teatroreal.dto.response.SignageEntryResponse;
import com.teatroreal.service.tempo.SignageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para endpoints de cartelería digital.
 * Endpoints públicos (sin autenticación) para mostrar en pantallas.
 */
@RestController
@RequestMapping("/api/signage")
@RequiredArgsConstructor
@Tag(name = "Cartelería", description = "Endpoints para cartelería digital")
public class SignageController {

    private final SignageService signageService;

    @GetMapping("/global")
    @Operation(summary = "Cartelería global", description = "Obtiene las actividades del día para todas las salas")
    public ResponseEntity<List<SignageEntryResponse>> getCarteleriaGlobal() {
        return ResponseEntity.ok(signageService.getCarteleriaGlobal());
    }

    @GetMapping("/{espacioId}")
    @Operation(summary = "Cartelería por sala", description = "Obtiene las actividades del día para una sala específica")
    public ResponseEntity<SignageEntryResponse> getCarteleriaSala(@PathVariable Long espacioId) {
        return ResponseEntity.ok(signageService.getCarteleriaSala(espacioId));
    }
}
