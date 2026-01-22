package com.teatroreal.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EspacioRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El tipo es obligatorio")
    private String tipo;

    private String googleCalendarId;

    private String color;

    @Min(value = 0, message = "La capacidad debe ser mayor o igual a 0")
    private Integer capacidad;

    private String dimensiones;

    private String ubicacion;

    private Boolean activo;

    @Min(value = 0, message = "El orden debe ser mayor o igual a 0")
    private Integer orden;
}
