package com.teatroreal.domain.user;

import jakarta.persistence.*;

@Entity
@Table(name = "permiso_modulo")
public class PermisoModulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String modulo;

    private String permiso;

    // Relaciones, si las hubiera, añadir aquí

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getModulo() { return modulo; }
    public void setModulo(String modulo) { this.modulo = modulo; }

    public String getPermiso() { return permiso; }
    public void setPermiso(String permiso) { this.permiso = permiso; }
}
