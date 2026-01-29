package com.teatroreal.dto.response;

import com.teatroreal.domain.tops.Guion;
import java.time.LocalDateTime;

/**
 * DTO para lista de guiones (sin árbol completo)
 */
public class GuionResponse {

    private String id;
    private String temporada;
    private String produccionNombre;
    private String compania;
    private String productor;
    private String responsableEdicion;
    private String directorEscena;
    private String directorMusical;
    private String subtitulo;
    private String compositor;
    private Integer version;
    private String versionNombre;
    private String estado;
    private boolean locked;
    private String lockedByNombre;
    private LocalDateTime lockedAt;
    private int totalActos;
    private long totalTops;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public GuionResponse() {}

    public static GuionResponse fromEntity(Guion guion) {
        return fromEntity(guion, 0L);
    }

    public static GuionResponse fromEntity(Guion guion, Long totalTops) {
        GuionResponse dto = new GuionResponse();
        dto.setId(guion.getId());
        dto.setTemporada(guion.getTemporada());
        dto.setProduccionNombre(guion.getProduccionNombre());
        dto.setCompania(guion.getCompania());
        dto.setProductor(guion.getProductor());
        dto.setResponsableEdicion(guion.getResponsableEdicion());
        dto.setDirectorEscena(guion.getDirectorEscena());
        dto.setDirectorMusical(guion.getDirectorMusical());
        dto.setSubtitulo(guion.getSubtitulo());
        dto.setCompositor(guion.getCompositor());
        dto.setVersion(guion.getVersion());
        dto.setVersionNombre(guion.getVersionNombre());
        dto.setEstado(guion.getEstado() != null ? guion.getEstado().name() : "BORRADOR");
        dto.setLocked(guion.isLocked());
        dto.setLockedByNombre(guion.getLockedBy() != null ? guion.getLockedBy().getNombre() : null);
        dto.setLockedAt(guion.getLockedAt());
        dto.setTotalActos(guion.getActos() != null ? guion.getActos().size() : 0);
        dto.setTotalTops(totalTops != null ? totalTops : 0);
        dto.setCreatedAt(guion.getCreatedAt());
        dto.setUpdatedAt(guion.getUpdatedAt());
        return dto;
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

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public boolean isLocked() { return locked; }
    public void setLocked(boolean locked) { this.locked = locked; }

    public String getLockedByNombre() { return lockedByNombre; }
    public void setLockedByNombre(String lockedByNombre) { this.lockedByNombre = lockedByNombre; }

    public LocalDateTime getLockedAt() { return lockedAt; }
    public void setLockedAt(LocalDateTime lockedAt) { this.lockedAt = lockedAt; }

    public int getTotalActos() { return totalActos; }
    public void setTotalActos(int totalActos) { this.totalActos = totalActos; }

    public long getTotalTops() { return totalTops; }
    public void setTotalTops(long totalTops) { this.totalTops = totalTops; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
