package com.teatroreal.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO para cambiar el estado de una actividad (máquina de estados almacén).
 * Frontend envía: { estado: "EN_TRANSITO" }
 * Valores válidos: PENDIENTE, EN_TRANSITO, COMPLETADO
 */
@Data
public class StatusActividadRequest {
    @NotBlank(message = "El estado es requerido")
    private String estado;  // PENDIENTE, EN_TRANSITO, COMPLETADO
}
