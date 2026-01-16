package com.teatroreal.domain.tops;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "escenas")
public class Escena implements Serializable {

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
    @JoinColumn(name = "acto_id", nullable = false)
    private Acto acto;

    @Column(nullable = false)
    private String nombre;

    private Integer orden = 0;

    @OneToMany(mappedBy = "escena", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orden ASC")
    private List<ElementoGuion> elementos = new ArrayList<>();

    // Getters y setters...
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Acto getActo() { return acto; }
    public void setActo(Acto acto) { this.acto = acto; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }

    public List<ElementoGuion> getElementos() { return elementos; }
    public void setElementos(List<ElementoGuion> elementos) { this.elementos = elementos; }
}
