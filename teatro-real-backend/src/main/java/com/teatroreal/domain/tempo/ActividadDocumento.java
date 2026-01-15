package com.teatroreal.domain.tempo;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "actividad_documentos")
public class ActividadDocumento {

    public enum Origen {
        LOCAL, DRIVE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // referencia a la actividad origen
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actividad_id", nullable = false)
    private Actividad actividad;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Origen origen;

    @Column(nullable = false)
    private String nombreArchivo;

    @Column(nullable = false)
    private String urlArchivo;
}
