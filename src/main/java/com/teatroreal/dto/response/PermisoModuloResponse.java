package com.teatroreal.dto.response;

public class PermisoModuloResponse {
    public Long id;
    public String usuarioId;
    public String modulo;
    public String nivelAcceso;

    public static PermisoModuloResponse from(com.teatroreal.domain.user.PermisoModulo entity) {
        PermisoModuloResponse dto = new PermisoModuloResponse();
        dto.id = entity.getId();
<<<<<<< HEAD
        if (entity.getUsuario() != null) {
            // Si hay error de compilación aquí, verifica que Usuario tenga un método getId()
            dto.usuarioId = entity.getUsuario().getId();
        }
        dto.modulo = entity.getModulo() != null ? entity.getModulo().name() : null;
        dto.nivelAcceso = entity.getNivelAcceso() != null ? entity.getNivelAcceso().name() : null;
=======
        // No existe el método getUsuario() en PermisoModulo, así que se asigna null.
        dto.usuarioId = null;
        dto.modulo = entity.getModulo();
        // No hay campo nivelAcceso en el modelo PermisoModulo
        dto.nivelAcceso = null;
>>>>>>> 5f5ad938ebc041f2e716139a5623612b8f844e98
        return dto;
    }
}
