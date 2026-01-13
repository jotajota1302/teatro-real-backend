package com.teatroreal.domain.tempo;

import com.teatroreal.domain.user.Usuario;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "departamentos")
public class Departamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String codigo;

    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jefe_id")
    private Usuario jefe;

    private String ambito;
    private String colorHex;

    @ManyToMany
    @JoinTable(
        name = "departamento_usuarios",
        joinColumns = @JoinColumn(name = "departamento_id"),
        inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private Set<Usuario> personal = new HashSet<>();

    // Getters and setters (omitidos por brevedad pero asumidos)
}
