package com.teatroreal.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ActividadResponse {
    private String id;
    private String titulo;
    private String temporada;
    private String descripcion;
    private String estado;
    private String fecha;
    private String horaInicio;
    private String horaFin;
    private String notas;
    private TipoActividadInfo tipoActividad;
    private EspacioInfo espacio;
    private DepartamentoInfo departamento; // Puede ser null
    private String createdAt;
    private String updatedAt;

    // Almacén:
    private String tipoMovimiento;
    private Integer numCamiones;
    private String lugarOrigen;
    private String lugarDestino;
    private String produccionNombre;

    // Google Calendar
    private String googleEventId;
    private String ultimaSincronizacion;

    @Getter
    @Setter
    @Builder
    public static class TipoActividadInfo {
        private String id;
        private String nombre;
        private String colorHex;
    }

    @Getter
    @Setter
    @Builder
    public static class EspacioInfo {
        private String id;
        private String nombre;
    }

    @Getter
    @Setter
    @Builder
    public static class DepartamentoInfo {
        private String id;
        private String nombre;
    }
}
