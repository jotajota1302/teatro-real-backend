package com.teatroreal.dto.response;

import com.teatroreal.domain.tops.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO para guion completo con todo el árbol (para el editor)
 */
public class GuionCompletoResponse {

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
    private String lockedById;
    private LocalDateTime lockedAt;
    private List<ActoDto> actos = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static GuionCompletoResponse fromEntity(Guion guion) {
        GuionCompletoResponse dto = new GuionCompletoResponse();
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
        dto.setLockedById(guion.getLockedBy() != null ? guion.getLockedBy().getId() : null);
        dto.setLockedAt(guion.getLockedAt());
        dto.setCreatedAt(guion.getCreatedAt());
        dto.setUpdatedAt(guion.getUpdatedAt());

        // Convertir actos con todo el árbol
        if (guion.getActos() != null) {
            dto.setActos(guion.getActos().stream()
                    .map(ActoDto::fromEntity)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    // DTOs anidados
    public static class ActoDto {
        private String id;
        private String nombre;
        private Integer orden;
        private List<PasadaItemDto> pasada = new ArrayList<>();
        private List<EscenaDto> escenas = new ArrayList<>();

        public static ActoDto fromEntity(Acto acto) {
            ActoDto dto = new ActoDto();
            dto.setId(String.valueOf(acto.getId()));
            dto.setNombre(acto.getNombre());
            dto.setOrden(acto.getOrden());

            if (acto.getPasadaItems() != null) {
                dto.setPasada(acto.getPasadaItems().stream()
                        .map(PasadaItemDto::fromEntity)
                        .collect(Collectors.toList()));
            }

            if (acto.getEscenas() != null) {
                dto.setEscenas(acto.getEscenas().stream()
                        .map(EscenaDto::fromEntity)
                        .collect(Collectors.toList()));
            }

            return dto;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        public Integer getOrden() { return orden; }
        public void setOrden(Integer orden) { this.orden = orden; }
        public List<PasadaItemDto> getPasada() { return pasada; }
        public void setPasada(List<PasadaItemDto> pasada) { this.pasada = pasada; }
        public List<EscenaDto> getEscenas() { return escenas; }
        public void setEscenas(List<EscenaDto> escenas) { this.escenas = escenas; }
    }

    public static class PasadaItemDto {
        private String id;
        private String tipoItem;
        private String tituloPlano;
        private String departamento;
        private String lugar;
        private String descripcion;
        private List<String> imagenes = new ArrayList<>();
        private Integer orden;

        public static PasadaItemDto fromEntity(PasadaItem item) {
            PasadaItemDto dto = new PasadaItemDto();
            dto.setId(String.valueOf(item.getId()));
            dto.setTipoItem(item.getTipoItem() != null ? item.getTipoItem().name() : "INSTRUCCION_TECNICA");
            dto.setTituloPlano(item.getTituloPlano());
            dto.setDepartamento(item.getDepartamento());
            dto.setLugar(item.getLugar());
            dto.setDescripcion(item.getDescripcion());
            dto.setOrden(item.getOrden());
            // imagenes se poblarán después desde GuionImageService
            return dto;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTipoItem() { return tipoItem; }
        public void setTipoItem(String tipoItem) { this.tipoItem = tipoItem; }
        public String getTituloPlano() { return tituloPlano; }
        public void setTituloPlano(String tituloPlano) { this.tituloPlano = tituloPlano; }
        public String getDepartamento() { return departamento; }
        public void setDepartamento(String departamento) { this.departamento = departamento; }
        public String getLugar() { return lugar; }
        public void setLugar(String lugar) { this.lugar = lugar; }
        public String getDescripcion() { return descripcion; }
        public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
        public List<String> getImagenes() { return imagenes; }
        public void setImagenes(List<String> imagenes) { this.imagenes = imagenes; }
        public Integer getOrden() { return orden; }
        public void setOrden(Integer orden) { this.orden = orden; }
    }

    public static class EscenaDto {
        private String id;
        private String nombre;
        private String tipoSeccion;
        private String duracion;
        private Integer orden;
        private List<ElementoDto> elementos = new ArrayList<>();

        public static EscenaDto fromEntity(Escena escena) {
            EscenaDto dto = new EscenaDto();
            dto.setId(String.valueOf(escena.getId()));
            dto.setNombre(escena.getNombre());
            dto.setTipoSeccion(escena.getTipoSeccion() != null ? escena.getTipoSeccion().name() : "ESCENA");
            dto.setDuracion(escena.getDuracion());
            dto.setOrden(escena.getOrden());

            if (escena.getElementos() != null) {
                dto.setElementos(escena.getElementos().stream()
                        .map(ElementoDto::fromEntity)
                        .collect(Collectors.toList()));
            }

            return dto;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        public String getTipoSeccion() { return tipoSeccion; }
        public void setTipoSeccion(String tipoSeccion) { this.tipoSeccion = tipoSeccion; }
        public String getDuracion() { return duracion; }
        public void setDuracion(String duracion) { this.duracion = duracion; }
        public Integer getOrden() { return orden; }
        public void setOrden(Integer orden) { this.orden = orden; }
        public List<ElementoDto> getElementos() { return elementos; }
        public void setElementos(List<ElementoDto> elementos) { this.elementos = elementos; }
    }

    public static class ElementoDto {
        private String id;
        private String tipoElemento;
        private String numero;
        private String refPagina;
        private String refCompas;
        private String refTimecode;
        private String pagina; // Formato combinado PIE
        private String departamento;
        private String descripcion;
        private String observaciones;
        private List<String> imagenes = new ArrayList<>();
        private String colorHex;
        private Integer orden;

        public static ElementoDto fromEntity(ElementoGuion elem) {
            ElementoDto dto = new ElementoDto();
            dto.setId(String.valueOf(elem.getId()));
            dto.setTipoElemento(elem.getTipoElemento() != null ? elem.getTipoElemento().name() : null);
            dto.setNumero(elem.getNumeroTop());
            dto.setRefPagina(elem.getRefPagina());
            dto.setRefCompas(elem.getRefCompas());
            dto.setRefTimecode(elem.getRefTimecode());
            dto.setPagina(elem.getPieFormateado());
            dto.setDepartamento(elem.getDepartamento());
            dto.setDescripcion(elem.getEncabezado());
            dto.setObservaciones(elem.getContenido());
            dto.setColorHex(elem.getColorHex());
            dto.setOrden(elem.getOrden());
            // imagenes se poblarán después desde GuionImageService
            return dto;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTipoElemento() { return tipoElemento; }
        public void setTipoElemento(String tipoElemento) { this.tipoElemento = tipoElemento; }
        public String getNumero() { return numero; }
        public void setNumero(String numero) { this.numero = numero; }
        public String getRefPagina() { return refPagina; }
        public void setRefPagina(String refPagina) { this.refPagina = refPagina; }
        public String getRefCompas() { return refCompas; }
        public void setRefCompas(String refCompas) { this.refCompas = refCompas; }
        public String getRefTimecode() { return refTimecode; }
        public void setRefTimecode(String refTimecode) { this.refTimecode = refTimecode; }
        public String getPagina() { return pagina; }
        public void setPagina(String pagina) { this.pagina = pagina; }
        public String getDepartamento() { return departamento; }
        public void setDepartamento(String departamento) { this.departamento = departamento; }
        public String getDescripcion() { return descripcion; }
        public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
        public String getObservaciones() { return observaciones; }
        public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
        public List<String> getImagenes() { return imagenes; }
        public void setImagenes(List<String> imagenes) { this.imagenes = imagenes; }
        public String getColorHex() { return colorHex; }
        public void setColorHex(String colorHex) { this.colorHex = colorHex; }
        public Integer getOrden() { return orden; }
        public void setOrden(Integer orden) { this.orden = orden; }
    }

    // Getters y setters principales
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
    public String getLockedById() { return lockedById; }
    public void setLockedById(String lockedById) { this.lockedById = lockedById; }
    public LocalDateTime getLockedAt() { return lockedAt; }
    public void setLockedAt(LocalDateTime lockedAt) { this.lockedAt = lockedAt; }
    public List<ActoDto> getActos() { return actos; }
    public void setActos(List<ActoDto> actos) { this.actos = actos; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
