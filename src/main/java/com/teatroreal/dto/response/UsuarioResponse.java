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
