package com.teatroreal.controller.auth;

import com.teatroreal.dto.request.AuthRequest;
import com.teatroreal.dto.response.AuthResponse;
import com.teatroreal.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "Autenticación de usuarios")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    // Simulación de login (ejemplo básico, normalmente validaría contra la base de datos)
    @PostMapping("/login")
    @Operation(summary = "Autenticación mediante usuario/email/contraseña",
               responses = {@ApiResponse(responseCode = "200", description = "Login OK")})
    public AuthResponse login(@RequestBody AuthRequest req) {
        // Realmente: validar usuario y pass
        String fakeUserId = "1";
        String token = jwtUtil.generateToken(fakeUserId, req.getEmail());
        return new AuthResponse(token);
    }

    @GetMapping("/me")
    @Operation(summary = "Obtener usuario autenticado", responses = {
        @ApiResponse(responseCode = "200", description = "Usuario autenticado actual")
    })
    public String me() {
        // Debe devolver datos del usuario autenticado (mock aquí)
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
        // Demo: regenerar token (realmente se validarían claims, expiración, etc.)
        String token = jwtUtil.generateToken("1", "demo@teatroreal.com");
        return new AuthResponse(token);
    }
}
