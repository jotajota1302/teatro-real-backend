package com.teatroreal.controller.admin;

import com.teatroreal.domain.user.PermisoModulo;
import com.teatroreal.domain.user.Usuario;
import com.teatroreal.dto.response.PermisoModuloResponse;
import com.teatroreal.dto.response.UsuarioResponse;
import com.teatroreal.dto.response.RolResponse;
import com.teatroreal.dto.response.DepartamentoResponse;
import com.teatroreal.repository.PermisoModuloRepository;
import com.teatroreal.repository.UsuarioRepository;
import com.teatroreal.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "Gestión de usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PermisoModuloRepository permisoModuloRepository;

    @Autowired
    private RolRepository rolRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ==================== ME endpoints ====================

    @GetMapping("/me")
    @Operation(summary = "Obtener usuario autenticado actual")
    public UsuarioResponse me() {
        String userId = getCurrentUserId();
        Usuario usuario = usuarioRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        return toResponse(usuario);
    }

    @GetMapping("/me/permisos-modulo")
    @Operation(summary = "Obtener permisos de módulo del usuario actual")
    public List<PermisoModuloResponse> mePermisosModulo() {
        String userId = getCurrentUserId();
        return permisoModuloRepository.findByUsuarioId(userId)
            .stream()
            .map(PermisoModuloResponse::from)
            .collect(Collectors.toList());
    }

    // ==================== CRUD endpoints ====================

    @GetMapping
    @Operation(summary = "Listar todos los usuarios")
    public List<UsuarioResponse> findAll() {
        return usuarioRepository.findAll()
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID")
    public UsuarioResponse findById(@PathVariable String id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        return toResponse(usuario);
    }

    @PostMapping
    @Operation(summary = "Crear nuevo usuario")
    public UsuarioResponse create(@RequestBody UsuarioCreateRequest request) {
        // Verificar que el email no existe
        if (usuarioRepository.findByEmail(request.email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El email ya existe");
        }

        Usuario usuario = new Usuario();
        usuario.setEmail(request.email);
        usuario.setNombre(request.nombre);
        usuario.setPasswordHash(passwordEncoder.encode(request.password));
        usuario.setActivo(true);

        // Asignar rol
        if (request.rolId != null) {
            usuario.setRol(rolRepository.findById(request.rolId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol no encontrado")));
        }

        usuario = usuarioRepository.save(usuario);
        return toResponse(usuario);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario")
    public UsuarioResponse update(@PathVariable String id, @RequestBody UsuarioUpdateRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (request.nombre != null) {
            usuario.setNombre(request.nombre);
        }
        if (request.email != null) {
            // Verificar que el email no existe en otro usuario
            usuarioRepository.findByEmail(request.email)
                .ifPresent(u -> {
                    if (!u.getId().equals(id)) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El email ya existe");
                    }
                });
            usuario.setEmail(request.email);
        }
        if (request.password != null && !request.password.isEmpty()) {
            usuario.setPasswordHash(passwordEncoder.encode(request.password));
        }
        if (request.activo != null) {
            usuario.setActivo(request.activo);
        }
        if (request.rolId != null) {
            usuario.setRol(rolRepository.findById(request.rolId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol no encontrado")));
        }

        usuario = usuarioRepository.save(usuario);
        return toResponse(usuario);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario")
    public void delete(@PathVariable String id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        // Primero eliminar permisos
        permisoModuloRepository.deleteByUsuarioId(id);
        usuarioRepository.deleteById(id);
    }

    // ==================== Permisos endpoints ====================

    @GetMapping("/{id}/permisos-modulo")
    @Operation(summary = "Obtener permisos de módulo de un usuario")
    public List<PermisoModuloResponse> getPermisosModulo(@PathVariable String id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        return permisoModuloRepository.findByUsuarioId(id)
            .stream()
            .map(PermisoModuloResponse::from)
            .collect(Collectors.toList());
    }

    @PutMapping("/{id}/permisos-modulo")
    @Operation(summary = "Actualizar permisos de módulo de un usuario")
    public List<PermisoModuloResponse> updatePermisosModulo(
            @PathVariable String id,
            @RequestBody List<PermisoModuloRequest> permisos) {

        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        // Actualizar o crear permisos
        for (PermisoModuloRequest request : permisos) {
            PermisoModulo.Modulo modulo = PermisoModulo.Modulo.valueOf(request.modulo);
            PermisoModulo.NivelAcceso nivelAcceso = PermisoModulo.NivelAcceso.valueOf(request.nivelAcceso);

            PermisoModulo permiso = permisoModuloRepository.findByUsuarioIdAndModulo(id, modulo)
                .orElseGet(() -> {
                    PermisoModulo nuevo = new PermisoModulo();
                    nuevo.setUsuario(usuario);
                    nuevo.setModulo(modulo);
                    return nuevo;
                });

            permiso.setNivelAcceso(nivelAcceso);
            permisoModuloRepository.save(permiso);
        }

        return permisoModuloRepository.findByUsuarioId(id)
            .stream()
            .map(PermisoModuloResponse::from)
            .collect(Collectors.toList());
    }

    // ==================== Helpers ====================

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No autenticado");
        }
        return auth.getName();
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        UsuarioResponse response = new UsuarioResponse();
        response.id = usuario.getId();
        response.email = usuario.getEmail();
        response.nombre = usuario.getNombre();
        response.avatarUrl = usuario.getAvatarUrl();
        response.activo = usuario.getActivo();
        response.ultimoAcceso = usuario.getUltimoAcceso();

        if (usuario.getRol() != null) {
            response.rol = new RolResponse();
            response.rol.id = usuario.getRol().getId();
            response.rol.nombre = usuario.getRol().getNombreStr();
            response.rol.descripcion = usuario.getRol().getDescripcion();
        }

        if (usuario.getDepartamento() != null) {
            response.departamento = new DepartamentoResponse();
            response.departamento.id = usuario.getDepartamento().getId();
            response.departamento.codigo = usuario.getDepartamento().getCodigo();
            response.departamento.nombre = usuario.getDepartamento().getNombre();
        }

        return response;
    }

    // ==================== Request DTOs ====================

    public static class UsuarioCreateRequest {
        public String email;
        public String nombre;
        public String password;
        public Long rolId;
    }

    public static class UsuarioUpdateRequest {
        public String email;
        public String nombre;
        public String password;
        public Boolean activo;
        public Long rolId;
    }

    public static class PermisoModuloRequest {
        public String modulo; // TEMPO, TOPS, ADMIN
        public String nivelAcceso; // LECTURA, ESCRITURA, COMPLETO, NINGUNO
    }
}
