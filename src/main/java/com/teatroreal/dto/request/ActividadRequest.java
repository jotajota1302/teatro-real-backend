package com.teatroreal.dto.request;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Getter
@Setter
public class ActividadRequest {

    @NotBlank
    @Size(max = 255)
    private String titulo;

    @NotBlank
    @Size(max = 20)
    private String temporada; // Ej: "2025-2026"

    private Long temporadaId; // Opcional

    @NotBlank
    private String tipoActividadId;

    @NotBlank
    private String espacioId;

    @NotNull
    private String fecha; // ISO-8601 (yyyy-MM-dd)

    @NotNull
    private String horaInicio; // ISO-8601 (HH:mm)

    @NotNull
    private String horaFin; // ISO-8601 (HH:mm)

    private String departamentoId; // Opcional

    @Size(max = 1000)
    private String descripcion; // Opcional

    @Size(max = 500)
    private String notas; // Opcional

    private String tipoMovimiento; // Opcional, enum: ENTRADA, SALIDA, INTERNO

    private Integer numCamiones; // Opcional

    private String lugarOrigen; // Opcional
    private String lugarDestino; // Opcional
    private String produccionNombre; // Opcional

    private String estado; // Opcional. Enum: PENDIENTE, EN_TRANSITO, COMPLETADO
}
