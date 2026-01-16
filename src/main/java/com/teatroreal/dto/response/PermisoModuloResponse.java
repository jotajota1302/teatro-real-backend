package com.teatroreal.dto.response;

public class PermisoModuloResponse {
    public Long id;
    public String usuarioId;
    public String modulo;
    public String nivelAcceso;

    public static PermisoModuloResponse from(com.teatroreal.domain.user.PermisoModulo entity) {
        PermisoModuloResponse dto = new PermisoModuloResponse();
        dto.id = entity.getId();
        // No existe el método getUsuario() en PermisoModulo, así que se asigna null.
        dto.usuarioId = null;
        dto.modulo = entity.getModulo();
        // No hay campo nivelAcceso en el modelo PermisoModulo
        dto.nivelAcceso = null;
        return dto;
    }
}
