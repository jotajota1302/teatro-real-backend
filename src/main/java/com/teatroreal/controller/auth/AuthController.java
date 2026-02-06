package com.teatroreal.controller.auth;

import com.teatroreal.domain.user.Usuario;
import com.teatroreal.dto.request.AuthRequest;
import com.teatroreal.dto.response.AuthResponse;
import com.teatroreal.repository.UsuarioRepository;
import com.teatroreal.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "Autenticación de usuarios")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    @Operation(summary = "Autenticación mediante email/contraseña",
               responses = {@ApiResponse(responseCode = "200", description = "Login OK")})
    public AuthResponse login(@RequestBody AuthRequest req) {
        // Buscar usuario por email
        Usuario usuario = usuarioRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));

        // Verificar que el usuario está activo
        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario desactivado");
        }

        // Verificar password
        if (usuario.getPasswordHash() == null ||
            !passwordEncoder.matches(req.getPassword(), usuario.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        }

        // Actualizar último acceso
        usuario.setUltimoAcceso(LocalDateTime.now());
        usuarioRepository.save(usuario);

        // Generar token JWT
        String token = jwtUtil.generateToken(usuario.getId(), usuario.getEmail());
        return new AuthResponse(token);
    }

    @GetMapping("/me")
    @Operation(summary = "Obtener usuario autenticado", responses = {
        @ApiResponse(responseCode = "200", description = "Usuario autenticado actual")
    })
    public String me() {
        return "usuario_actual";
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout del sistema")
    public void logout() {
        // En apps JWT, logout es solo client-side (borrar token)
    }

    @PostMapping("/refresh")
    @Operation(summary = "Renovar token")
    public AuthResponse refresh(@RequestBody String oldToken) {
        String token = jwtUtil.generateToken("1", "demo@teatroreal.com");
        return new AuthResponse(token);
    }
}
