package com.teatroreal.controller;

import com.teatroreal.domain.user.Usuario;
import com.teatroreal.service.user.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "Gestión CRUD de usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Listar todos los usuarios", responses = {
            @ApiResponse(responseCode = "200", description = "Listado usuarios")
    })
    public List<Usuario> findAll() {
        return usuarioService.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID")
    public Usuario findById(@PathVariable String id) {
        return usuarioService.findById(id);
    }

    @PostMapping
    @Operation(summary = "Crear nuevo usuario")
    public Usuario create(@RequestBody Usuario usuario) {
        return usuarioService.create(usuario);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario existente")
    public Usuario update(@PathVariable String id, @RequestBody Usuario usuario) {
        return usuarioService.update(id, usuario);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario")
    public void delete(@PathVariable String id) {
        usuarioService.delete(id);
    }
}
