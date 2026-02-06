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

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guion_id", nullable = false)
    private Guion guion;

    @Column(nullable = false)
    private String nombre;

    private Integer orden = 0;

    // Pasada: setup inicial del acto (antes de que empiece)
    @OneToMany(mappedBy = "acto", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orden ASC")
    private Set<PasadaItem> pasadaItems = new LinkedHashSet<>();

    // Escenas del acto
    @OneToMany(mappedBy = "acto", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orden ASC")
    private Set<Escena> escenas = new LinkedHashSet<>();

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Getters y setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Guion getGuion() { return guion; }
    public void setGuion(Guion guion) { this.guion = guion; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }

    public Set<PasadaItem> getPasadaItems() { return pasadaItems; }
    public void setPasadaItems(Set<PasadaItem> pasadaItems) { this.pasadaItems = pasadaItems; }

    public Set<Escena> getEscenas() { return escenas; }
    public void setEscenas(Set<Escena> escenas) { this.escenas = escenas; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Helper: añadir pasada item
    public void addPasadaItem(PasadaItem item) {
        pasadaItems.add(item);
        item.setActo(this);
    }

    // Helper: añadir escena
    public void addEscena(Escena escena) {
        escenas.add(escena);
        escena.setActo(this);
    }
}
