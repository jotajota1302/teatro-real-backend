package com.teatroreal.domain.tops;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Elemento de Guion - Componente atómico del sistema TOPS
 * Puede ser TOP, Entrada, Mutis, Interno, etc.
 */
@Entity
@Table(name = "elementos_guion", indexes = {
        @Index(name = "idx_elemento_escena", columnList = "escena_id"),
        @Index(name = "idx_elemento_tipo", columnList = "tipo_elemento")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElementoGuion {

    @Id
    @Column(length = 36)
    private String id;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "escena_id", nullable = false)
    private Escena escena;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_elemento", nullable = false)
    private TipoElemento tipoElemento;

    @Column(name = "numero")
    private String numeroTop;

    @Column(name = "ref_pagina")
    private String refPagina;

    @Column(name = "ref_compas")
    private String refCompas;

    @Column(name = "ref_timecode")
    private String refTimecode;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String encabezado;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String contenido;

    @Column(length = 100)
    private String departamento;

    @Column(name = "orden")
    private Integer orden = 0;

    @Column(name = "color_hex")
    private String colorHex;

    /**
     * URL o ID de imagen asociada al elemento
     * Almacena la URL del endpoint de imagen: /api/tops/images/{id}
     */
    @Column(name = "imagen", length = 500)
    private String imagen;

    /**
     * Devuelve PIE formateado como "x/y/z"
     * Usado para validación y display
     *
     * @return String con formato "página/compás/timecode" o null si no están todos los valores
     */
    @Transient
    public String getPieFormateado() {
        if (refPagina == null || refCompas == null || refTimecode == null) {
            return null;
        }
        return String.format("%s/%s/%s", refPagina, refCompas, refTimecode);
    }

    /**
     * Establece PIE desde formato "x/y/z"
     * Parsea la cadena y asigna a los campos refPagina, refCompas, refTimecode
     *
     * @param pieFormateado String en formato "x/y/z"
     */
    public void setPieFromFormato(String pieFormateado) {
        if (pieFormateado == null || pieFormateado.trim().isEmpty()) {
            this.refPagina = null;
            this.refCompas = null;
            this.refTimecode = null;
            return;
        }

        String[] parts = pieFormateado.split("/");
        if (parts.length == 3) {
            this.refPagina = parts[0].trim();
            this.refCompas = parts[1].trim();
            this.refTimecode = parts[2].trim();
        }
    }

    /**
     * Tipos de elementos que puede contener un guion
     */
    public enum TipoElemento {
        TOP,                           // Instrucción técnica
        ENTRADA,                       // Indicación tipo E
        MUTIS,                         // Indicación tipo M
        INTERNO,                       // Indicación tipo INT
        AVISO,
        PASADA_ITEM,
        INSTRUCCION_TECNICA_PASADA,    // Instrucción técnica en Pasada
        PLANO_ESCENARIO,               // Plano de escenario
        ANOTACION_LIBRE                // Anotación libre
    }
}
