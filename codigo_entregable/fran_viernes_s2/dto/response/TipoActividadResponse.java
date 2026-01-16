package com.teatroreal.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TipoActividadResponse {
    private Long id;
    private String nombre;
    private String color;
    private Boolean activo;
    private String descripcion;
}
