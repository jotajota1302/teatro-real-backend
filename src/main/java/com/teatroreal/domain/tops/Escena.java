package com.teatroreal.domain.tops;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;

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

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acto_id", nullable = false)
    private Acto acto;

    @Column(nullable = false)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_seccion", nullable = false, length = 20)
    private TipoSeccion tipoSeccion = TipoSeccion.ESCENA;

    // Duración aproximada de la escena (ej: "4'", "6'30''")
    @Column(length = 20)
    private String duracion;

    private Integer orden = 0;

    @OneToMany(mappedBy = "escena", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orden ASC")
    private Set<ElementoGuion> elementos = new LinkedHashSet<>();

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Getters y setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Acto getActo() { return acto; }
    public void setActo(Acto acto) { this.acto = acto; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public TipoSeccion getTipoSeccion() { return tipoSeccion; }
    public void setTipoSeccion(TipoSeccion tipoSeccion) { this.tipoSeccion = tipoSeccion; }

    public String getDuracion() { return duracion; }
    public void setDuracion(String duracion) { this.duracion = duracion; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }

    public Set<ElementoGuion> getElementos() { return elementos; }
    public void setElementos(Set<ElementoGuion> elementos) { this.elementos = elementos; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Helper: añadir elemento
    public void addElemento(ElementoGuion elemento) {
        elementos.add(elemento);
        elemento.setEscena(this);
    }

    public enum TipoSeccion {
        ESCENA,
        PAUSA
    }
}
