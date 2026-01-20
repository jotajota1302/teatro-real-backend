package com.teatroreal.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TipoActividadResponse {
    private String id;
    private String nombre;
    private String colorHex;
    private String descripcion;
    private Boolean activo;
}
