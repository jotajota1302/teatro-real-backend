package com.teatroreal.domain.user;

import javax.persistence.*;

@Entity
@Table(name = "permisos_modulo",
    uniqueConstraints = {@UniqueConstraint(columnNames = {"usuario_id", "modulo"})}
)
public class PermisoModulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Modulo modulo; // TEMPO, TOPS, ADMIN

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NivelAcceso nivelAcceso; // LECTURA, ESCRITURA, COMPLETO, NINGUNO

    public enum Modulo { TEMPO, TOPS, ADMIN }
    public enum NivelAcceso { LECTURA, ESCRITURA, COMPLETO, NINGUNO }

    // Getters and setters (omitidos por brevedad pero asumidos)
}
