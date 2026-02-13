package com.teatroreal.domain.tops;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "colores_elemento_guion")
public class ColorElementoGuion implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private ElementoGuion.TipoElemento tipoElemento;

    @Column(nullable = false, length = 7)
    private String colorHex;

    private String descripcion;

    // Getters y setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ElementoGuion.TipoElemento getTipoElemento() { return tipoElemento; }
    public void setTipoElemento(ElementoGuion.TipoElemento tipoElemento) { this.tipoElemento = tipoElemento; }

    public String getColorHex() { return colorHex; }
    public void setColorHex(String colorHex) { this.colorHex = colorHex; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
