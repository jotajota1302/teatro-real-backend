package com.teatroreal.controller;

import com.teatroreal.dto.ApiResponse;
import com.teatroreal.dto.EspacioDTO;
import com.teatroreal.service.EspacioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/espacios")
@RequiredArgsConstructor
@Tag(name = "Espacios", description = "Gestión de espacios y salas del teatro")
public class EspacioController {

    private final EspacioService espacioService;

    @GetMapping
    @Operation(
            summary = "Listar todos los espacios",
            description = "Obtiene la lista completa de espacios del teatro"
    )
    public ResponseEntity<ApiResponse<List<EspacioDTO>>> findAll() {
        List<EspacioDTO> espacios = espacioService.findAll();
        return ResponseEntity.ok(ApiResponse.success(espacios));
    }

    @GetMapping("/activos")
    @Operation(
            summary = "Listar espacios activos",
            description = "Obtiene solo los espacios que están activos"
    )
    public ResponseEntity<ApiResponse<List<EspacioDTO>>> findAllActivos() {
        List<EspacioDTO> espacios = espacioService.findAllActivos();
        return ResponseEntity.ok(ApiResponse.success(espacios));
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtener espacio por ID",
            description = "Obtiene los detalles de un espacio específico"
    )
    public ResponseEntity<ApiResponse<EspacioDTO>> findById(
            @Parameter(description = "ID del espacio") @PathVariable Long id) {
        EspacioDTO espacio = espacioService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(espacio));
    }

    @PostMapping
    @Operation(
            summary = "Crear espacio",
            description = "Crea un nuevo espacio en el sistema"
    )
    public ResponseEntity<ApiResponse<EspacioDTO>> create(
            @Valid @RequestBody EspacioDTO espacioDTO) {
        EspacioDTO created = espacioService.create(espacioDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Espacio creado correctamente", created));
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Actualizar espacio",
            description = "Actualiza los datos de un espacio existente"
    )
    public ResponseEntity<ApiResponse<EspacioDTO>> update(
            @Parameter(description = "ID del espacio") @PathVariable Long id,
            @Valid @RequestBody EspacioDTO espacioDTO) {
        EspacioDTO updated = espacioService.update(id, espacioDTO);
        return ResponseEntity.ok(ApiResponse.success("Espacio actualizado correctamente", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Eliminar espacio",
            description = "Elimina un espacio del sistema"
    )
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "ID del espacio") @PathVariable Long id) {
        espacioService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Espacio eliminado correctamente", null));
    }
}
