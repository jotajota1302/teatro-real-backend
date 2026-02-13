package com.teatroreal.controller.tempo;

import com.teatroreal.dto.response.ActividadDocumentoResponse;
import com.teatroreal.service.tempo.ActividadDocumentoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/actividades/{actividadId}/documentos")
@RequiredArgsConstructor
public class ActividadDocumentoController {

    private final ActividadDocumentoService service;

    @Operation(summary = "Subir documento para una actividad")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Documento subido"),
        @ApiResponse(responseCode = "404", description = "Actividad no encontrada")
    })
    @PostMapping
    public ResponseEntity<ActividadDocumentoResponse> upload(
            @PathVariable String actividadId,
            @RequestParam("archivo") MultipartFile archivo,
            @RequestParam("origen") String origen
    ) {
        ActividadDocumentoResponse response = service.uploadDocumento(actividadId, archivo, origen);
        return ResponseEntity.status(201).body(response);
    }

    @Operation(summary = "Listar documentos de una actividad")
    @ApiResponse(responseCode = "200", description = "Lista de documentos")
    @GetMapping
    public ResponseEntity<List<ActividadDocumentoResponse>> listar(
            @PathVariable String actividadId
    ) {
        List<ActividadDocumentoResponse> docs = service.listarPorActividad(actividadId);
        return ResponseEntity.ok(docs);
    }
}
