package com.teatroreal.domain.tempo;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "departamentos")
public class Departamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    private String codigo;
    private String descripcion;
    private String ambito;
    private String colorHex;

    // Relaciones relevantes según necesidad del modelo
    @ManyToOne
    @JoinColumn(name = "jefe_id")
    private com.teatroreal.domain.user.Usuario jefe;

    @ManyToMany
    @JoinTable(
        name = "departamento_personal",
        joinColumns = @JoinColumn(name = "departamento_id"),
        inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private Set<com.teatroreal.domain.user.Usuario> personal;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getAmbito() { return ambito; }
    public void setAmbito(String ambito) { this.ambito = ambito; }

    public String getColorHex() { return colorHex; }
    public void setColorHex(String colorHex) { this.colorHex = colorHex; }

    public com.teatroreal.domain.user.Usuario getJefe() { return jefe; }
    public void setJefe(com.teatroreal.domain.user.Usuario jefe) { this.jefe = jefe; }

    public Set<com.teatroreal.domain.user.Usuario> getPersonal() { return personal; }
    public void setPersonal(Set<com.teatroreal.domain.user.Usuario> personal) { this.personal = personal; }
}
