package com.teatroreal.domain.tops;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "elementos_guion")
public class ElementoGuion implements Serializable {

    @Id
    @Column(length = 36)
    private String id;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
    }

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "escena_id", nullable = false)
    private Escena escena;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_elemento", nullable = false, length = 20)
    private TipoElemento tipoElemento;

    // Número de TOP (ej: "22", "23.1", "23.2") o código para otros tipos
    @Column(length = 20)
    private String numero;

    // Referencias a partitura según requisitos v1.3
    @Column(name = "ref_pagina", length = 50)
    private String refPagina;

    @Column(name = "ref_compas", length = 50)
    private String refCompas;

    @Column(name = "ref_timecode", length = 50)
    private String refTimecode;

    // Departamento(s) responsable(s) - puede ser múltiple separado por comas
    @Column(length = 100)
    private String departamento;

    // QUIEN/QUE: Descripción detallada de la acción
    @Column(columnDefinition = "TEXT")
    private String descripcion;

    // Observaciones adicionales
    @Column(columnDefinition = "TEXT")
    private String observaciones;

    // URL de imagen de soporte
    @Column(length = 500)
    private String imagen;

    // Color opcional (override del color por defecto del tipo)
    @Column(name = "color_hex", length = 7)
    private String colorHex;

    private Integer orden = 0;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum TipoElemento {
        TOP,        // Orden técnica sincronizada
        ENTRADA,    // Entrada (E)
        MUTIS,      // Mutis (M)
        INTERNO,    // Interno (INT)
        AVISO,      // Aviso (Avs)
        PASADA_ITEM // Item de pasada (legacy)
    }

    // Getters y setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Escena getEscena() { return escena; }
    public void setEscena(Escena escena) { this.escena = escena; }

    public TipoElemento getTipoElemento() { return tipoElemento; }
    public void setTipoElemento(TipoElemento tipoElemento) { this.tipoElemento = tipoElemento; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getRefPagina() { return refPagina; }
    public void setRefPagina(String refPagina) { this.refPagina = refPagina; }

    public String getRefCompas() { return refCompas; }
    public void setRefCompas(String refCompas) { this.refCompas = refCompas; }

    public String getRefTimecode() { return refTimecode; }
    public void setRefTimecode(String refTimecode) { this.refTimecode = refTimecode; }

    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public String getColorHex() { return colorHex; }
    public void setColorHex(String colorHex) { this.colorHex = colorHex; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Helper: obtener referencia de partitura formateada (PIE)
    public String getRefPartituraFormateada() {
        StringBuilder sb = new StringBuilder();
        if (refPagina != null && !refPagina.isEmpty()) {
            sb.append(refPagina);
        }
        if (refCompas != null && !refCompas.isEmpty()) {
            if (sb.length() > 0) sb.append("/");
            sb.append(refCompas);
        }
        if (refTimecode != null && !refTimecode.isEmpty()) {
            if (sb.length() > 0) sb.append(" ");
            sb.append("[").append(refTimecode).append("]");
        }
        return sb.toString();
    }
}
