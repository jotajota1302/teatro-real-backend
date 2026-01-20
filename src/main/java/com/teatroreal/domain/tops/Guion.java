package com.teatroreal.domain.tops;

import com.teatroreal.domain.user.Usuario;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "guiones")
public class Guion implements Serializable {

    @Id
    @Column(length = 36)
    private String id;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
    }

    @Column(nullable = false)
    private String temporada;

    @Column(nullable = false)
    private String produccionNombre;
    private String compania;
    private String productor;
    private String responsableEdicion;
    private String directorEscena;
    private String directorMusical;

    private Integer version = 1;
    private String versionNombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locked_by")
    private Usuario lockedBy;

    private LocalDateTime lockedAt;

    @Enumerated(EnumType.STRING)
    private EstadoGuion estado;

    @OneToMany(mappedBy = "guion", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orden ASC")
    private List<Acto> actos = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Usuario createdBy;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum EstadoGuion {
        BORRADOR, EN_EDICION, VALIDADO, PUBLICADO
    }

    // Getters y setters...

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTemporada() { return temporada; }
    public void setTemporada(String temporada) { this.temporada = temporada; }

    public String getProduccionNombre() { return produccionNombre; }
    public void setProduccionNombre(String produccionNombre) { this.produccionNombre = produccionNombre; }

    public String getCompania() { return compania; }
    public void setCompania(String compania) { this.compania = compania; }

    public String getProductor() { return productor; }
    public void setProductor(String productor) { this.productor = productor; }

    public String getResponsableEdicion() { return responsableEdicion; }
    public void setResponsableEdicion(String responsableEdicion) { this.responsableEdicion = responsableEdicion; }

    public String getDirectorEscena() { return directorEscena; }
    public void setDirectorEscena(String directorEscena) { this.directorEscena = directorEscena; }

    public String getDirectorMusical() { return directorMusical; }
    public void setDirectorMusical(String directorMusical) { this.directorMusical = directorMusical; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }

    public String getVersionNombre() { return versionNombre; }
    public void setVersionNombre(String versionNombre) { this.versionNombre = versionNombre; }

    public Usuario getLockedBy() { return lockedBy; }
    public void setLockedBy(Usuario lockedBy) { this.lockedBy = lockedBy; }

    public LocalDateTime getLockedAt() { return lockedAt; }
    public void setLockedAt(LocalDateTime lockedAt) { this.lockedAt = lockedAt; }

    public EstadoGuion getEstado() { return estado; }
    public void setEstado(EstadoGuion estado) { this.estado = estado; }

    public List<Acto> getActos() { return actos; }
    public void setActos(List<Acto> actos) { this.actos = actos; }

    public Usuario getCreatedBy() { return createdBy; }
    public void setCreatedBy(Usuario createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
