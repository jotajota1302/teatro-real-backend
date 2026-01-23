package com.teatroreal.tempo.presentation.controller;

import com.teatroreal.tempo.application.dto.CreateEspacioRequest;
import com.teatroreal.tempo.application.dto.EspacioDTO;
import com.teatroreal.tempo.application.service.EspacioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tempo/espacios")
@Tag(name = "Espacios", description = "Gestión de espacios del teatro")
public class EspacioController {

    private final EspacioService espacioService;

    public EspacioController(EspacioService espacioService) {
        this.espacioService = espacioService;
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo espacio")
    public ResponseEntity<EspacioDTO> crearEspacio(@RequestBody CreateEspacioRequest request) {
        EspacioDTO espacioDTO = espacioService.crearEspacio(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(espacioDTO);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un espacio por ID")
    public ResponseEntity<EspacioDTO> obtenerEspacio(@PathVariable String id) {
        EspacioDTO espacioDTO = espacioService.obtenerEspacio(id);
        return ResponseEntity.ok(espacioDTO);
    }

    @GetMapping
    @Operation(summary = "Listar todos los espacios")
    public ResponseEntity<List<EspacioDTO>> listarEspacios() {
        List<EspacioDTO> espacios = espacioService.listarEspacios();
        return ResponseEntity.ok(espacios);
    }

    @GetMapping("/activos")
    @Operation(summary = "Listar espacios activos")
    public ResponseEntity<List<EspacioDTO>> listarEspaciosActivos() {
        List<EspacioDTO> espacios = espacioService.listarEspaciosActivos();
        return ResponseEntity.ok(espacios);
    }

    @GetMapping("/nombre/{nombre}")
    @Operation(summary = "Obtener espacio por nombre")
    public ResponseEntity<EspacioDTO> obtenerEspacioPorNombre(@PathVariable String nombre) {
        EspacioDTO espacioDTO = espacioService.obtenerEspacioPorNombre(nombre);
        return ResponseEntity.ok(espacioDTO);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un espacio")
    public ResponseEntity<EspacioDTO> actualizarEspacio(
            @PathVariable String id,
            @RequestBody CreateEspacioRequest request) {
        EspacioDTO espacioDTO = espacioService.actualizarEspacio(id, request);
        return ResponseEntity.ok(espacioDTO);
    }

    @PutMapping("/{id}/desactivar")
    @Operation(summary = "Desactivar un espacio")
    public ResponseEntity<Void> desactivarEspacio(@PathVariable String id) {
        espacioService.desactivarEspacio(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/activar")
    @Operation(summary = "Activar un espacio")
    public ResponseEntity<Void> activarEspacio(@PathVariable String id) {
        espacioService.activarEspacio(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un espacio")
    public ResponseEntity<Void> eliminarEspacio(@PathVariable String id) {
        espacioService.eliminarEspacio(id);
        return ResponseEntity.noContent().build();
    }
}
