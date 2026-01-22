package com.teatroreal.controller.tempo;

import com.teatroreal.dto.response.ApiResponse;
import com.teatroreal.dto.response.tempo.EspacioDto;
import com.teatroreal.service.tempo.EspacioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Espacios TEMPO", description = "Endpoints públicos de gestión de espacios para TEMPO")
public class EspacioController {

    private final EspacioService espacioService;

    @Operation(summary = "Listado de espacios disponibles", description = "Devuelve los espacios que utiliza el módulo TEMPO para mostrar el grid general.")
    @GetMapping("/api/v1/espacios")
    public ApiResponse<List<EspacioDto>> listarEspacios() {
        List<EspacioDto> espacios = espacioService.listarEspacios();
        return ApiResponse.success(espacios);
    }
}
