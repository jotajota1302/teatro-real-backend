package com.teatroreal.dto.request;

import com.teatroreal.domain.tops.ElementoGuion;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO para crear/actualizar un ElementoGuion
 * Incluye validaciones básicas (más validaciones en backend)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElementoGuionRequest {

    @NotNull(message = "Tipo de elemento es obligatorio")
    private ElementoGuion.TipoElemento tipoElemento;

    private String numeroTop;          // TOP E/M (ej: 120 o 120.5)

    private String refPagina;          // Componente de PIE
    private String refCompas;          // Componente de PIE
    private String refTimecode;        // Componente de PIE

    @Size(max = 500, message = "Encabezado no puede exceder 500 caracteres")
    private String encabezado;

    private String contenido;          // Rich-text

    private String departamento;       // Catálogo fijo

    private Integer orden;

    private String imagen;             // URL de imagen asociada

    /**
     * Devuelve PIE formateado como "x/y/z" desde los componentes
     */
    public String getPieFormateado() {
        if (refPagina == null || refCompas == null || refTimecode == null) {
            return null;
        }
        return String.format("%s/%s/%s", refPagina, refCompas, refTimecode);
    }
}
