package com.teatroreal.domain.tops;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;

/**
 * Representa un item de la sección "Pasada" de un acto.
 * La Pasada es el setup inicial que debe ocurrir antes de que empiece el acto.
 * Según TR-Requisitos v1.3: incluye departamento, lugar y descripción detallada.
 */
@Entity
@Table(name = "pasada_items")
public class PasadaItem implements Serializable {

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

    // Departamento responsable (M.E., MAQ., Útil., Elec., A/V., Sast., Carac., Otros)
    @Column(length = 20)
    private String departamento;

    // Lugar (Escena, Varas, Plataf., Fosos, etc.)
    @Column(length = 100)
    private String lugar;

    // Descripción detallada del setup
    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_item", nullable = false, length = 30)
    private TipoPasadaItem tipoItem = TipoPasadaItem.INSTRUCCION_TECNICA;

    @Column(name = "titulo_plano", length = 255)
    private String tituloPlano;

    // URL de imagen de soporte
    @Column(length = 500)
    private String imagen;

    private Integer orden = 0;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Getters y setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Acto getActo() { return acto; }
    public void setActo(Acto acto) { this.acto = acto; }

    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }

    public String getLugar() { return lugar; }
    public void setLugar(String lugar) { this.lugar = lugar; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public TipoPasadaItem getTipoItem() { return tipoItem; }
    public void setTipoItem(TipoPasadaItem tipoItem) { this.tipoItem = tipoItem; }

    public String getTituloPlano() { return tituloPlano; }
    public void setTituloPlano(String tituloPlano) { this.tituloPlano = tituloPlano; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public enum TipoPasadaItem {
        INSTRUCCION_TECNICA,
        PLANO_ESCENARIO
    }
}
