package com.teatroreal.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ElementoGuionRequest {
    private String texto;
    private String tipoElemento; // Enum: TOP, ENTRADA, MUTIS, etc.
    private Integer orden;
    private String colorHex; // opcional para override
}
