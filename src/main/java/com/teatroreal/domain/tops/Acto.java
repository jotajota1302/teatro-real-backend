package com.teatroreal.domain.tops;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "actos")
public class Acto implements Serializable {

    @Id
    @Column(length = 36)
    private String id;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guion_id", nullable = false)
    private Guion guion;

    @Column(nullable = false)
    private String nombre;

    private Integer orden = 0;

    @OneToMany(mappedBy = "acto", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orden ASC")
    private List<Escena> escenas = new ArrayList<>();

    // Getters y setters...
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Guion getGuion() { return guion; }
    public void setGuion(Guion guion) { this.guion = guion; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }

    public List<Escena> getEscenas() { return escenas; }
    public void setEscenas(List<Escena> escenas) { this.escenas = escenas; }
}
