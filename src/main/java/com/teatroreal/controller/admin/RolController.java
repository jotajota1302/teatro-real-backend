package com.teatroreal.controller.admin;

import com.teatroreal.domain.user.Rol;
import com.teatroreal.dto.response.RolResponse;
import com.teatroreal.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/roles")
@Tag(name = "Roles", description = "Gestión de roles")
public class RolController {

    @Autowired
    private RolRepository rolRepository;

    @GetMapping
    @Operation(summary = "Listar todos los roles")
    public List<RolResponse> findAll() {
        return rolRepository.findAll()
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    private RolResponse toResponse(Rol rol) {
        RolResponse response = new RolResponse();
        response.id = rol.getId();
        response.nombre = rol.getNombreStr();
        response.descripcion = rol.getDescripcion();
        if (rol.getPermisos() != null) {
            response.permisos = rol.getPermisos().toArray(new String[0]);
        }
        return response;
    }
}
