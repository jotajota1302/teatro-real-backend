package com.teatroreal.controller;

import com.teatroreal.dto.response.*;
import com.teatroreal.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "Gestión de usuarios")
public class UsuarioController {
    private final UsuarioService usuarioService;
    public UsuarioController(UsuarioService usuarioService) { this.usuarioService = usuarioService; }

    @GetMapping
    @Operation(summary = "Listar todos los usuarios", responses = {
            @ApiResponse(responseCode = "200", description = "Listado usuarios")
    })
    public List<UsuarioResponse> getAll() {
        // Mapping real a DTO pendiente...
        return List.of();
    }
}

@RestController
@RequestMapping("/api/roles")
@Tag(name = "Roles", description = "Gestión de roles")
public class RolController {
    private final RolService rolService;
    public RolController(RolService rolService) { this.rolService = rolService; }

    @GetMapping
    @Operation(summary = "Listar todos los roles", responses = {
            @ApiResponse(responseCode = "200", description = "Listado roles")
    })
    public List<RolResponse> getAll() {
        return List.of();
    }
}

@RestController
@RequestMapping("/api/departamentos")
@Tag(name = "Departamentos", description = "Gestión de departamentos")
public class DepartamentoController {
    private final DepartamentoService departamentoService;
    public DepartamentoController(DepartamentoService departamentoService) { this.departamentoService = departamentoService; }

    @GetMapping
    @Operation(summary = "Listar departamentos", responses = {
            @ApiResponse(responseCode = "200", description = "Listado departamentos")
    })
    public List<DepartamentoResponse> getAll() {
        return List.of();
    }
}

@RestController
@RequestMapping("/api/temporadas")
@Tag(name = "Temporadas", description = "Gestión de temporadas")
public class TemporadaController {
    private final TemporadaService temporadaService;
    public TemporadaController(TemporadaService temporadaService) { this.temporadaService = temporadaService; }

    @GetMapping
    @Operation(summary = "Listar temporadas", responses = {
            @ApiResponse(responseCode = "200", description = "Listado temporadas")
    })
    public List<TemporadaResponse> getAll() {
        return List.of();
    }
}

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
        return List.of();
    }
}
