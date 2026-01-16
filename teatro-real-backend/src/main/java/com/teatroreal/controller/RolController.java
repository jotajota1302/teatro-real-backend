package com.teatroreal.controller;

import com.teatroreal.dto.response.RolResponse;
import com.teatroreal.service.RolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Collections;

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
        return Collections.emptyList();
    }
}
