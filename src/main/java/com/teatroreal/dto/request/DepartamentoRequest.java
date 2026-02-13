package com.teatroreal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

public class DepartamentoRequest {
    
    @NotBlank(message = "El código es obligatorio")
    @Size(max = 10, message = "El código no puede exceder 10 caracteres")
    private String codigo;
    
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    
    private String descripcion;
    private String ambito;
    
    @Size(max = 7, message = "El color debe ser un código hexadecimal válido")
    private String colorHex;
    
    private String jefeId;
    private Set<String> personalIds;

    public DepartamentoRequest() {}

    // Getters y Setters
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getAmbito() { return ambito; }
    public void setAmbito(String ambito) { this.ambito = ambito; }

    public String getColorHex() { return colorHex; }
    public void setColorHex(String colorHex) { this.colorHex = colorHex; }

    public String getJefeId() { return jefeId; }
    public void setJefeId(String jefeId) { this.jefeId = jefeId; }

    public Set<String> getPersonalIds() { return personalIds; }
    public void setPersonalIds(Set<String> personalIds) { this.personalIds = personalIds; }
}
