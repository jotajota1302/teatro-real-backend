package com.teatroreal.domain.tops;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.UUID;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "escena_id", nullable = false)
    private Escena escena;

    @Column(nullable = false)
    private String texto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoElemento tipoElemento; // TOP, ENTRADA, MUTIS, etc.

    private Integer orden = 0;

    private String colorHex; // Opcional: puede venir de configuración de colores

    // Getters y setters...
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Escena getEscena() { return escena; }
    public void setEscena(Escena escena) { this.escena = escena; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public TipoElemento getTipoElemento() { return tipoElemento; }
    public void setTipoElemento(TipoElemento tipoElemento) { this.tipoElemento = tipoElemento; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }

    public String getColorHex() { return colorHex; }
    public void setColorHex(String colorHex) { this.colorHex = colorHex; }

    public enum TipoElemento {
        TOP, ENTRADA, MUTIS, INTERNO, AVISO, PASADA_ITEM
    }
}
