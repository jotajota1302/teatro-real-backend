package com.teatroreal.dto.response;

import java.util.List;

public class DepartamentoResponse {
    public Long id;
    public String codigo;
    public String nombre;
    public String descripcion;
    public String ambito;
    public String colorHex;
    public UsuarioResponse jefe;
    public List<UsuarioResponse> personal;
}
