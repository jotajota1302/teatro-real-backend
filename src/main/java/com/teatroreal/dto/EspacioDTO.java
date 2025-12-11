package com.teatroreal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EspacioDTO {

    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El tipo es obligatorio")
    private String tipo;

    private String descripcion;

    private Integer capacidad;

    private Boolean activo;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
