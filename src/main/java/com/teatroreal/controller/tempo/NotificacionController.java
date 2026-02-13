package com.teatroreal.controller.tempo;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    @GetMapping
    public ResponseEntity<List<NotificacionDTO>> getMockNotificaciones() {
        List<NotificacionDTO> notificaciones = Arrays.asList(
            new NotificacionDTO(1L, "1", "INFO", "Bienvenido a Teatro Real", "Has iniciado sesión correctamente.", "ACTIVIDAD", "A1", false, "2026-01-20T15:00:00Z"),
            new NotificacionDTO(2L, "1", "WARNING", "Cambio de horario", "Se ha modificado una actividad.", "ACTIVIDAD", "A2", false, "2026-01-20T15:03:00Z"),
            new NotificacionDTO(3L, "1", "ERROR", "Permiso insuficiente", "No tienes permisos para editar este módulo.", null, null, true, "2026-01-19T16:30:00Z")
        );
        return ResponseEntity.ok(notificaciones);
    }

    public static class NotificacionDTO {
        public Long id;
        public String usuarioId;
        public String tipo;
        public String titulo;
        public String mensaje;
        public String entidadTipo;
        public String entidadId;
        public boolean leida;
        public String createdAt;
        public NotificacionDTO(Long id, String usuarioId, String tipo, String titulo, String mensaje, String entidadTipo,
                               String entidadId, boolean leida, String createdAt) {
            this.id = id;
            this.usuarioId = usuarioId;
            this.tipo = tipo;
            this.titulo = titulo;
            this.mensaje = mensaje;
            this.entidadTipo = entidadTipo;
            this.entidadId = entidadId;
            this.leida = leida;
            this.createdAt = createdAt;
        }
    }
}
