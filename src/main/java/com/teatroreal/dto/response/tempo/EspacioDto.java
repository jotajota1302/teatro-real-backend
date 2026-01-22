package com.teatroreal.dto.response.tempo;

public class EspacioDto {

    private String nombre;
    private String tipo;
    private String icon;
    private boolean disponible;

    public EspacioDto() {
    }

    public EspacioDto(String nombre, String tipo, String icon, boolean disponible) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.icon = icon;
        this.disponible = disponible;
    }

    public String getNombre() {
        return nombre;
    }

    public String getTipo() {
        return tipo;
    }

    public String getIcon() {
        return icon;
    }

    public boolean isDisponible() {
        return disponible;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public void setDisponible(boolean disponible) {
        this.disponible = disponible;
    }
}
