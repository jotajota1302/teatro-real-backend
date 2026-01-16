package com.teatroreal.dto.request;

import lombok.Getter;
import lombok.Setter;

<<<<<<< HEAD
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
=======
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
>>>>>>> 5f5ad938ebc041f2e716139a5623612b8f844e98

@Getter
@Setter
public class TipoActividadRequest {

    @NotBlank
    @Size(max = 100)
    private String nombre;

    @NotBlank
    @Size(max = 7)
    private String colorHex;

    @Size(max = 250)
    private String descripcion;
}
