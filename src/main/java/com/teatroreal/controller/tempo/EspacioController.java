package com.teatroreal.controller.tempo;

import com.teatroreal.dto.request.EspacioRequest;
import com.teatroreal.dto.response.EspacioResponse;
import com.teatroreal.service.tempo.EspacioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("espacioTempoController")
@RequestMapping("/api/espacios")
@RequiredArgsConstructor
@Tag(name = "Espacios TEMPO", description = "Endpoints de gestión de espacios para TEMPO")
public class EspacioController {

    private final EspacioService espacioService;

    @Operation(summary = "Listar espacios disponibles")
    @ApiResponse(responseCode = "200", description = "Espacios listados")
    @GetMapping
    public ResponseEntity<List<EspacioResponse>> getAll() {
        return ResponseEntity.ok(espacioService.getAll());
    }

    @Operation(summary = "Obtener un espacio por id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Espacio encontrado"),
            @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<EspacioResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(espacioService.getById(id));
    }

    @Operation(summary = "Crear un espacio")
    @ApiResponse(responseCode = "201", description = "Espacio creado")
    @PostMapping
    public ResponseEntity<EspacioResponse> create(@Valid @RequestBody EspacioRequest request) {
        EspacioResponse response = espacioService.create(request);
        return ResponseEntity.status(201).body(response);
    }

    @Operation(summary = "Actualizar un espacio")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Espacio actualizado"),
            @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<EspacioResponse> update(@PathVariable Long id, @Valid @RequestBody EspacioRequest request) {
        return ResponseEntity.ok(espacioService.update(id, request));
    }

    @Operation(summary = "Eliminar un espacio")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Eliminado"),
            @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        espacioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
