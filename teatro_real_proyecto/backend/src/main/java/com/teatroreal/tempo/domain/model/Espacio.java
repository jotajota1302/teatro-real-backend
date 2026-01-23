package com.teatroreal.tempo.domain.model;

import java.time.Instant;

/**
 * Modelo de dominio para Espacio (sin JPA).
 */
public class Espacio {
    private String id;
    private String nombre;
    private String tipo;
    private String ubicacion;
    private String codigoColor;
    private boolean activo;
    private Instant fechaCreacion;
    private Instant fechaActualizacion;

    // Constructores
    public Espacio() {
    }

    public Espacio(String id, String nombre, String tipo, String ubicacion,
                   String codigoColor, boolean activo, Instant fechaCreacion,
                   Instant fechaActualizacion) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.ubicacion = ubicacion;
        this.codigoColor = codigoColor;
        this.activo = activo;
        this.fechaCreacion = fechaCreacion;
        this.fechaActualizacion = fechaActualizacion;
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getCodigoColor() {
        return codigoColor;
    }

    public void setCodigoColor(String codigoColor) {
        this.codigoColor = codigoColor;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public Instant getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Instant fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Instant getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(Instant fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    // Métodos de negocio
    public void activar() {
        this.activo = true;
        this.fechaActualizacion = Instant.now();
    }

    public void desactivar() {
        this.activo = false;
        this.fechaActualizacion = Instant.now();
    }
}
