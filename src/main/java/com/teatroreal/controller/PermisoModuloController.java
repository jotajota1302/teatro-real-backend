package com.teatroreal.controller;

import com.teatroreal.dto.response.PermisoModuloResponse;
import com.teatroreal.service.PermisoModuloService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Collections;

@RestController
@RequestMapping("/api/permisos-modulo")
@Tag(name = "PermisosModulo", description = "Gestión de permisos por módulo")
public class PermisoModuloController {
    private final PermisoModuloService permisoModuloService;
    public PermisoModuloController(PermisoModuloService permisoModuloService) { this.permisoModuloService = permisoModuloService; }

    @GetMapping
    @Operation(summary = "Listar permisos por módulo", responses = {
            @ApiResponse(responseCode = "200", description = "Listado permisos por módulo")
    })
    public List<PermisoModuloResponse> getAll() {
        return Collections.emptyList();
    }
}
