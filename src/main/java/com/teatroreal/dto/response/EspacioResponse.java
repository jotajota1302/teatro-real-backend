package com.teatroreal.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EspacioResponse {
    private Long id;
    private String nombre;
    private String tipo;
    private String googleCalendarId;
    private String color;
    private Integer capacidad;
    private String dimensiones;
    private String ubicacion;
    private Boolean activo;
    private Integer orden;
}
