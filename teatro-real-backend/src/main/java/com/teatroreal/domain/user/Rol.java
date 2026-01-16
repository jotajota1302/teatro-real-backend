package com.teatroreal.domain.user;

<<<<<<< HEAD
import javax.persistence.*;
=======
import jakarta.persistence.*;
>>>>>>> 5f5ad938ebc041f2e716139a5623612b8f844e98
import java.util.Set;

@Entity
@Table(name = "roles")
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private RolNombre nombre;

    private String descripcion;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "rol_permisos", joinColumns = @JoinColumn(name = "rol_id"))
    @Column(name = "permiso")
    private Set<String> permisos;

    public Long getId() { return id; }
    public RolNombre getNombre() { return nombre; }
    public void setNombre(RolNombre nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Set<String> getPermisos() { return permisos; }
    public void setPermisos(Set<String> permisos) { this.permisos = permisos; }
}

// Enum for roles
enum RolNombre {
    ADMIN, GESTOR, OPERADOR, VISUALIZADOR
}
