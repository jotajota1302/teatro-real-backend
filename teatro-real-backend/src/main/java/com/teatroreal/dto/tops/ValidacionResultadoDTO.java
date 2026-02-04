package com.teatroreal.dto.tops;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para devolver resultados de validación
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ValidacionResultadoDTO {

    private boolean valido;
    private String mensaje;
    private String campo;
    private String valorRecibido;

    public static ValidacionResultadoDTO valido() {
        return ValidacionResultadoDTO.builder()
                .valido(true)
                .build();
    }

    public static ValidacionResultadoDTO invalido(String campo, String mensaje) {
        return ValidacionResultadoDTO.builder()
                .valido(false)
                .campo(campo)
                .mensaje(mensaje)
                .build();
    }

    public static ValidacionResultadoDTO invalido(String campo, String mensaje, String valorRecibido) {
        return ValidacionResultadoDTO.builder()
                .valido(false)
                .campo(campo)
                .mensaje(mensaje)
                .valorRecibido(valorRecibido)
                .build();
    }
}
