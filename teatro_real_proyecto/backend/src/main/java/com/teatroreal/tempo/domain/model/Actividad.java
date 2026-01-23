package com.teatroreal.tempo.domain.model;

import java.time.Instant;
import java.time.LocalDateTime;

/**
 * Modelo de dominio para Actividad (sin JPA).
 */
public class Actividad {
    private String id;
    private String titulo;
    private TipoActividad tipo;
    private String espacioId;
    private LocalDateTime inicio;
    private LocalDateTime fin;
    private String codigoColor;
    private String responsable;
    private String descripcion;
    private boolean sincronizadaGoogleCalendar;
    private Instant createdAt;
    private Instant updatedAt;

    // Constructores
    public Actividad() {
    }

    public Actividad(String id, String titulo, TipoActividad tipo, String espacioId,
                     LocalDateTime inicio, LocalDateTime fin, String codigoColor,
                     String responsable, String descripcion, boolean sincronizadaGoogleCalendar,
                     Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.titulo = titulo;
        this.tipo = tipo;
        this.espacioId = espacioId;
        this.inicio = inicio;
        this.fin = fin;
        this.codigoColor = codigoColor;
        this.responsable = responsable;
        this.descripcion = descripcion;
        this.sincronizadaGoogleCalendar = sincronizadaGoogleCalendar;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public boolean isSincronizadaGoogleCalendar() {
        return sincronizadaGoogleCalendar;
    }

    public void setSincronizadaGoogleCalendar(boolean sincronizadaGoogleCalendar) {
        this.sincronizadaGoogleCalendar = sincronizadaGoogleCalendar;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Métodos de negocio
    public boolean solapaCon(Actividad otra) {
        if (!this.espacioId.equals(otra.espacioId)) {
            return false;
        }
        return inicio.isBefore(otra.fin) && fin.isAfter(otra.inicio);
    }

    public void marcarSincronizada() {
        this.sincronizadaGoogleCalendar = true;
        this.updatedAt = Instant.now();
    }
}
