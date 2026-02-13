package com.teatroreal.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ActividadDocumentoResponse {
    private String id;
    private String nombreArchivo;
    private String url;
    private String origen; // "LOCAL" o "DRIVE"
    private String fechaSubida;
}
