package com.teatroreal.dto.tops;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear/actualizar ElementoGuion
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElementoGuionRequest {

    @NotNull
    private Long escenaId;

    @NotNull
    private Long guionId;

    @NotNull
    @NotBlank
    private String tipoElemento;

    private String numeroTop;

    // PIE en formato "x/y/z"
    private String pie;

    @Size(max = 500)
    private String encabezado;

    @Size(max = 5000)
    private String contenido;

    @Size(max = 255)
    private String departamento;

    private Integer orden;

    private String colorHex;
}
