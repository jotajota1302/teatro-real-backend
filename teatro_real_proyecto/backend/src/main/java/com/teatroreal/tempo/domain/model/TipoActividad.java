package com.teatroreal.tempo.domain.model;

public enum TipoActividad {
    FUNCION("Función"),
    ENSAYO("Ensayo"),
    MANTENIMIENTO("Mantenimiento"),
    PREPARACION("Preparación"),
    OTRO("Otro");

    private final String descripcion;

    TipoActividad(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
