package com.teatroreal.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EspacioRequest {
    private String nombre;
    private String tipo;       // Enum: SALA, ALMACEN
    private String color;
    private Integer capacidad;
    private String dimensiones;
    private String ubicacion;
    private Boolean activo = true;
    private Integer orden;
}
