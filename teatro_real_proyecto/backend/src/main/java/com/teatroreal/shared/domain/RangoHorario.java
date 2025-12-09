package com.teatroreal.shared.domain;

import java.time.LocalDateTime;

/**
 * Rango horario de una actividad.
 */
public class RangoHorario {
    private LocalDateTime inicio;
    private LocalDateTime fin;

    // Constructores
    public RangoHorario() {
    }

    public RangoHorario(LocalDateTime inicio, LocalDateTime fin) {
        this.inicio = inicio;
        this.fin = fin;
    }

    // Getters y Setters
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

    // Métodos de negocio
    public boolean solapaCon(RangoHorario otro) {
        return inicio.isBefore(otro.fin) && fin.isAfter(otro.inicio);
    }

    public boolean contiene(LocalDateTime momento) {
        return !momento.isBefore(inicio) && !momento.isAfter(fin);
    }
}
