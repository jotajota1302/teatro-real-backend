package com.teatroreal.dto.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Getter
@Setter
public class ActividadRequest {

    @NotBlank
    private String temporadaId;

    @NotBlank
    private String tipoActividadId;

    @NotBlank
    @Size(max = 255)
    private String descripcion;

    @NotBlank
    private String estado; // Debe ser uno de: PROGRAMADA, EN_CURSO, FINALIZADA, CANCELADA

    @NotBlank
    private String fecha; // ISO-8601 (yyyy-MM-dd)

    @NotBlank
    private String horaInicio; // ISO-8601 (HH:mm)

    @NotBlank
    private String horaFin; // ISO-8601 (HH:mm)

    @NotBlank
    private String espacioId;

    private String departamentoId; // Opcional

    @Size(max = 500)
    private String notas; // Opcional
}
