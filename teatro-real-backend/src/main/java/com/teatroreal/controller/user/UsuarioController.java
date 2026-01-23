package com.teatroreal.controller.user;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Arrays;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> me() {
        // Devuelve usuario simulado con rol ADMIN y correo demo
        UsuarioDTO usuario = new UsuarioDTO(1L, "Demo User", "demo@teatroreal.es", "ADMIN");
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/me/permisos-modulo")
    public ResponseEntity<List<PermisoModuloDTO>> permisosModulo() {
        // Devuelve permisos simulados alineados al modelo TypeScript esperado por el frontend
        List<PermisoModuloDTO> permisos = Arrays.asList(
            new PermisoModuloDTO(1L, "mock", "TEMPO", "COMPLETO"),
            new PermisoModuloDTO(2L, "mock", "TOPS", "COMPLETO"),
            new PermisoModuloDTO(3L, "mock", "ADMIN", "COMPLETO")
        );
        return ResponseEntity.ok(permisos);
    }

    public static class UsuarioDTO {
        public Long id;
        public String nombre;
        public String email;
        public String rol;
        public UsuarioDTO(Long id, String nombre, String email, String rol) {
            this.id = id;
            this.nombre = nombre;
            this.email = email;
            this.rol = rol;
        }
    }

    // Modelo alineado con lo requerido por auth.models.ts
    public static class PermisoModuloDTO {
        public Long id;
        public String usuarioId;
        public String modulo; // "TEMPO", "TOPS", "ADMIN"
        public String nivelAcceso; // "COMPLETO"
        public PermisoModuloDTO(Long id, String usuarioId, String modulo, String nivelAcceso) {
            this.id = id;
            this.usuarioId = usuarioId;
            this.modulo = modulo;
            this.nivelAcceso = nivelAcceso;
        }
    }
}
