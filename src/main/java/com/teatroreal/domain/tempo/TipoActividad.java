package com.teatroreal.domain.tempo;

import jakarta.persistence.*;

@Entity
@Table(name = "tipo_actividad")
public class TipoActividad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    // Otros campos, getters y setters según necesidades

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}
