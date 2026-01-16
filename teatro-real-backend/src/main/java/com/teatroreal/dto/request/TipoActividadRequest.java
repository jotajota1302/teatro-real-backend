package com.teatroreal.dto.request;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Getter
@Setter
public class TipoActividadRequest {

    @NotBlank
    @Size(max = 100)
    private String nombre;

    @NotBlank
    @Size(max = 7)
    private String colorHex;

    @Size(max = 250)
    private String descripcion;

    private Boolean activo;
}
