package com.teatroreal.tempo.application.dto;

import com.teatroreal.tempo.domain.model.TipoActividad;
import java.time.LocalDateTime;

public class CreateActividadRequest {
    private String titulo;
    private TipoActividad tipo;
    private String espacioId;
    private LocalDateTime inicio;
    private LocalDateTime fin;
    private String codigoColor;
    private String responsable;
    private String descripcion;

    // Constructores
    public CreateActividadRequest() {
    }

    public CreateActividadRequest(String titulo, TipoActividad tipo, String espacioId, 
                                  LocalDateTime inicio, LocalDateTime fin, String codigoColor, 
                                  String responsable, String descripcion) {
        this.titulo = titulo;
        this.tipo = tipo;
        this.espacioId = espacioId;
        this.inicio = inicio;
        this.fin = fin;
        this.codigoColor = codigoColor;
        this.responsable = responsable;
        this.descripcion = descripcion;
    }

    // Getters y Setters
    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public TipoActividad getTipo() {
        return tipo;
    }

    public void setTipo(TipoActividad tipo) {
        this.tipo = tipo;
    }

    public String getEspacioId() {
        return espacioId;
    }

    public void setEspacioId(String espacioId) {
        this.espacioId = espacioId;
    }

    public LocalDateTime getInicio() {
        return inicio;
    }

    public void setInicio(LocalDateTime inicio) {
        this.inicio = inicio;
    }

    public LocalDateTime getFin() {
        return fin;
    }

    public void setFin(LocalDateTime fin) {
        this.fin = fin;
    }

    public String getCodigoColor() {
        return codigoColor;
    }

    public void setCodigoColor(String codigoColor) {
        this.codigoColor = codigoColor;
    }

    public String getResponsable() {
        return responsable;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
