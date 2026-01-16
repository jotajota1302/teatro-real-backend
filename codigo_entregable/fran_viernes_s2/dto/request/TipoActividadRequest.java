package com.teatroreal.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TipoActividadRequest {
    private String nombre;
    private String color;
    private Boolean activo = true;
    private String descripcion;
}
