package com.teatroreal.domain.user;

import jakarta.persistence.*;

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

    // Getters y setters necesarios para DTO y JPA

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Modulo getModulo() { return modulo; }
    public void setModulo(Modulo modulo) { this.modulo = modulo; }

    public NivelAcceso getNivelAcceso() { return nivelAcceso; }
    public void setNivelAcceso(NivelAcceso nivelAcceso) { this.nivelAcceso = nivelAcceso; }
}
