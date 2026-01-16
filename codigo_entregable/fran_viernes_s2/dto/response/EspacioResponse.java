package com.teatroreal.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EspacioResponse {
    private Long id;
    private String nombre;
    private String tipo;        // Enum: SALA, ALMACEN
    private String color;
    private Integer capacidad;
    private String dimensiones;
    private String ubicacion;
    private Boolean activo;
    private Integer orden;
}
