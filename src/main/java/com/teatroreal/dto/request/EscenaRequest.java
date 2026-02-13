package com.teatroreal.dto.request;

import com.teatroreal.domain.tops.Escena;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EscenaRequest {
    private String nombre;
    private Integer orden;
    private String duracion;
    private Escena.TipoSeccion tipoSeccion;
}
