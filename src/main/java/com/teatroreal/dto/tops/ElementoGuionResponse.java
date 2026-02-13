package com.teatroreal.dto.tops;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para devolver ElementoGuion
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElementoGuionResponse {

    private Long id;
    private Long escenaId;
    private Long guionId;
    private String tipoElemento;
    private String numeroTop;
    private String pie;
    private String encabezado;
    private String contenido;
    private String departamento;
    private Integer orden;
    private String colorHex;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
