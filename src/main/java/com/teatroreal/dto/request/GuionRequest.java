package com.teatroreal.dto.request;

import jakarta.validation.constraints.NotBlank;

public class GuionRequest {

    @NotBlank(message = "La temporada es requerida")
    private String temporada;

    @NotBlank(message = "El nombre de la producción es requerido")
    private String produccionNombre;

    private String compania;
    private String productor;
    private String responsableEdicion;
    private String directorEscena;
    private String directorMusical;
    private String subtitulo;
    private String compositor;
    private String versionNombre;

    // Getters y setters
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

    public String getVersionNombre() { return versionNombre; }
    public void setVersionNombre(String versionNombre) { this.versionNombre = versionNombre; }
}
