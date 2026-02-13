package com.teatroreal.dto.request;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Getter
@Setter
public class OperacionLogisticaRequest {

    @NotBlank(message = "El tipo de movimiento es obligatorio")
    private String tipoMovimiento; // ENTRADA, SALIDA, INTERNO

    @NotBlank(message = "El nombre de producción es obligatorio")
    private String produccionNombre;

    @NotBlank(message = "El lugar de origen es obligatorio")
    private String lugarOrigen;

    @NotBlank(message = "El lugar de destino es obligatorio")
    private String lugarDestino;

    @NotNull(message = "La fecha es obligatoria")
    private String fecha; // ISO-8601 (yyyy-MM-dd)

    @NotNull(message = "La hora de inicio es obligatoria")
    private String horaInicio; // HH:mm

    @NotNull(message = "La hora de fin es obligatoria")
    private String horaFin; // HH:mm

    @Min(value = 1, message = "El número de camiones debe ser al menos 1")
    private Integer numCamiones = 1;

    private String descripcion; // Opcional

    private Long almacenId; // Opcional - si no se indica, se usa el primero disponible
    private Long departamentoId; // Opcional - departamento responsable

    private Long temporadaId; // Opcional - si no se indica, se usa la activa
}
