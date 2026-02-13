package com.teatroreal.dto.response;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO ligero para vistas read-only de guion (TOPS)
 */
public class GuionVistaResponse {

    private String id;
    private String temporada;
    private String produccionNombre;
    private List<TopDto> tops = new ArrayList<>();

    public static class TopDto {
        private String id;
        private String actoNombre;
        private String escenaNombre;
        private String numero;
        private String departamento;
        private String descripcion;
        private String observaciones;
        private String pagina;
        private String colorHex;
        private Integer orden;
        private String imagen;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getActoNombre() { return actoNombre; }
        public void setActoNombre(String actoNombre) { this.actoNombre = actoNombre; }
        public String getEscenaNombre() { return escenaNombre; }
        public void setEscenaNombre(String escenaNombre) { this.escenaNombre = escenaNombre; }
        public String getNumero() { return numero; }
        public void setNumero(String numero) { this.numero = numero; }
        public String getDepartamento() { return departamento; }
        public void setDepartamento(String departamento) { this.departamento = departamento; }
        public String getDescripcion() { return descripcion; }
        public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
        public String getObservaciones() { return observaciones; }
        public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
        public String getPagina() { return pagina; }
        public void setPagina(String pagina) { this.pagina = pagina; }
        public String getColorHex() { return colorHex; }
        public void setColorHex(String colorHex) { this.colorHex = colorHex; }
        public Integer getOrden() { return orden; }
        public void setOrden(Integer orden) { this.orden = orden; }
        public String getImagen() { return imagen; }
        public void setImagen(String imagen) { this.imagen = imagen; }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTemporada() { return temporada; }
    public void setTemporada(String temporada) { this.temporada = temporada; }
    public String getProduccionNombre() { return produccionNombre; }
    public void setProduccionNombre(String produccionNombre) { this.produccionNombre = produccionNombre; }
    public List<TopDto> getTops() { return tops; }
    public void setTops(List<TopDto> tops) { this.tops = tops; }
}
