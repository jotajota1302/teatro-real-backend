package com.teatroreal.domain.tops;

import com.teatroreal.domain.user.Usuario;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

/**
 * Guion técnico de una producción.
 * Según TR-Requisitos v1.3: incluye metadata de la producción,
 * estructura jerárquica de actos→escenas→elementos, y control de bloqueo.
 */
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

    // Metadata del guion según requisitos v1.3
    @Column(nullable = false)
    private String temporada;

    @Column(name = "produccion_nombre", nullable = false)
    private String produccionNombre;

    private String compania;
    private String productor;

    @Column(name = "responsable_edicion")
    private String responsableEdicion;

    @Column(name = "director_escena")
    private String directorEscena;

    @Column(name = "director_musical")
    private String directorMusical;

    // Campos adicionales para el documento
    private String subtitulo;  // Ej: "Ópera en cuatro actos"
    private String compositor;

    // Versionado
    private Integer version = 1;

    @Column(name = "version_nombre")
    private String versionNombre;

    // Control de bloqueo para edición exclusiva
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locked_by")
    private Usuario lockedBy;

    @Column(name = "locked_at")
    private LocalDateTime lockedAt;

    @Enumerated(EnumType.STRING)
    private EstadoGuion estado = EstadoGuion.BORRADOR;

    // Estructura jerárquica: Guion → Actos
    @OneToMany(mappedBy = "guion", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orden ASC")
    private Set<Acto> actos = new LinkedHashSet<>();

    // Auditoría
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Usuario createdBy;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum EstadoGuion {
        BORRADOR,    // En creación
        EN_EDICION,  // Siendo editado activamente
        VALIDADO,    // Revisado y aprobado
        PUBLICADO    // Versión final
    }

    // Getters y setters
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

    public String getSubtitulo() { return subtitulo; }
    public void setSubtitulo(String subtitulo) { this.subtitulo = subtitulo; }

    public String getCompositor() { return compositor; }
    public void setCompositor(String compositor) { this.compositor = compositor; }

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

    public Set<Acto> getActos() { return actos; }
    public void setActos(Set<Acto> actos) { this.actos = actos; }

    public Usuario getCreatedBy() { return createdBy; }
    public void setCreatedBy(Usuario createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Helper: añadir acto
    public void addActo(Acto acto) {
        actos.add(acto);
        acto.setGuion(this);
    }

    // Helper: verificar si está bloqueado
    public boolean isLocked() {
        return lockedBy != null;
    }

    // Helper: verificar si está bloqueado por otro usuario
    public boolean isLockedByOther(String userId) {
        return lockedBy != null && !lockedBy.getId().equals(userId);
    }

    // Helper: contar TOPs en todo el guion
    public int contarTops() {
        int count = 0;
        for (Acto acto : actos) {
            for (Escena escena : acto.getEscenas()) {
                for (ElementoGuion elem : escena.getElementos()) {
                    if (elem.getTipoElemento() == ElementoGuion.TipoElemento.TOP) {
                        count++;
                    }
                }
            }
        }
        return count;
    }
}
