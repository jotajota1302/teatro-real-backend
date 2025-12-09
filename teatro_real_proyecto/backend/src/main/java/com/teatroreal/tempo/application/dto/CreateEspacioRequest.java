package com.teatroreal.tempo.application.dto;

public class CreateEspacioRequest {
    private String nombre;
    private String tipo;
    private String ubicacion;
    private String codigoColor;

    // Constructores
    public CreateEspacioRequest() {
    }

    public CreateEspacioRequest(String nombre, String tipo, String ubicacion, String codigoColor) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.ubicacion = ubicacion;
        this.codigoColor = codigoColor;
    }

    // Getters y Setters
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
}
