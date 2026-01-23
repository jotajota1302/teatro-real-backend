package com.teatroreal.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO para clonar una actividad a nueva fecha.
 * Frontend envía: { nuevaFecha: "2025-01-30" }
 */
@Data
public class CloneActividadRequest {
    @NotBlank(message = "La nueva fecha es requerida")
    private String nuevaFecha;  // Formato ISO-8601 yyyy-MM-dd
}
