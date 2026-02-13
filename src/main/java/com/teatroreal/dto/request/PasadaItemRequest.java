package com.teatroreal.dto.request;

import com.teatroreal.domain.tops.PasadaItem;

public class PasadaItemRequest {

    private String departamento;
    private String lugar;
    private String descripcion;
    private PasadaItem.TipoPasadaItem tipoItem;
    private String tituloPlano;
    private String imagen;
    private Integer orden;

    // Getters y setters
    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }

    public String getLugar() { return lugar; }
    public void setLugar(String lugar) { this.lugar = lugar; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public PasadaItem.TipoPasadaItem getTipoItem() { return tipoItem; }
    public void setTipoItem(PasadaItem.TipoPasadaItem tipoItem) { this.tipoItem = tipoItem; }

    public String getTituloPlano() { return tituloPlano; }
    public void setTituloPlano(String tituloPlano) { this.tituloPlano = tituloPlano; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }
}
