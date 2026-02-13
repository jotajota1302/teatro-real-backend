package com.teatroreal.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

/**
 * DTO para respuesta de cartelería digital.
 * Usado para mostrar actividades en pantallas de salas.
 */
@Data
@Builder
public class SignageEntryResponse {
    private Long espacioId;
    private String espacioNombre;
    private String espacioTipo;
    private String espacioColor;
    private List<ActividadSignage> actividades;

    @Data
    @Builder
    public static class ActividadSignage {
        private String id;
        private String titulo;
        private String descripcion;
        private String fecha;
        private String horaInicio;
        private String horaFin;
        private String tipoActividadNombre;
        private String tipoActividadColor;
        private String departamentoNombre;
        private String estado;
    }
}
