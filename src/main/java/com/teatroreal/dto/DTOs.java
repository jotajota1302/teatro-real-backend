package com.teatroreal.dto.response;

import java.time.LocalDateTime;

public class UsuarioResponse {
    public String id;
    public String email;
    public String nombre;
    public String avatarUrl;
    public RolResponse rol;
    public DepartamentoResponse departamento;
    public Boolean activo;
    public LocalDateTime ultimoAcceso;
}

public class RolResponse {
    public Long id;
    public String nombre;
    public String descripcion;
    public String[] permisos;
}

public class DepartamentoResponse {
    public Long id;
    public String codigo;
    public String nombre;
    public String descripcion;
    public String ambito;
    public String colorHex;
    public UsuarioResponse jefe;
}

public class PermisoModuloResponse {
    public Long id;
    public String usuarioId;
    public String modulo;
    public String nivelAcceso;
}

public class TemporadaResponse {
    public Long id;
    public String nombre;
    public String fechaInicio;
    public String fechaFin;
    public Boolean activa;
}
