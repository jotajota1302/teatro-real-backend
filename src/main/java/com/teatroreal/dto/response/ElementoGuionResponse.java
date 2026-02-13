package com.teatroreal.dto.response;

import com.teatroreal.domain.tops.ElementoGuion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO para ElementoGuion
 * Usado en respuestas de API y para serialización a JSON
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElementoGuionResponse {

    private String id;

    private ElementoGuion.TipoElemento tipoElemento;

    private String numeroTop;

    private String refPagina;
    private String refCompas;
    private String refTimecode;
    private String pieFormateado;

    private String encabezado;

    private String contenido;

    private String departamento;

    private Integer orden;

    private String colorHex;

    private String imagen;

    /**
     * Mapea desde entidad a DTO
     */
    public static ElementoGuionResponse fromEntity(ElementoGuion elemento) {
        return ElementoGuionResponse.builder()
                .id(elemento.getId())
                .tipoElemento(elemento.getTipoElemento())
                .numeroTop(elemento.getNumeroTop())
                .refPagina(elemento.getRefPagina())
                .refCompas(elemento.getRefCompas())
                .refTimecode(elemento.getRefTimecode())
                .pieFormateado(elemento.getPieFormateado())
                .encabezado(elemento.getEncabezado())
                .contenido(elemento.getContenido())
                .departamento(elemento.getDepartamento())
                .orden(elemento.getOrden())
                .colorHex(elemento.getColorHex())
                .imagen(elemento.getImagen())
                .build();
    }
}
