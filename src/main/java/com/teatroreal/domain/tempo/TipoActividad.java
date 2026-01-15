package com.teatroreal.domain.tempo;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "tipos_actividad")
@Data
public class TipoActividad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 80)
    @Column(nullable = false, unique = true)
    private String nombre;

    @Size(max = 7)
    @Column(name = "color_hex")
    private String colorHex;
}
