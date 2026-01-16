package com.teatroreal.dto.response;

public class PermisoModuloResponse {
    public Long id;
    public String usuarioId;
    public String modulo;
    public String nivelAcceso;

    public static PermisoModuloResponse from(com.teatroreal.domain.user.PermisoModulo entity) {
        PermisoModuloResponse dto = new PermisoModuloResponse();
        dto.id = entity.getId();
        if (entity.getUsuario() != null) {
            // Si hay error de compilación aquí, verifica que Usuario tenga un método getId()
            dto.usuarioId = entity.getUsuario().getId();
        }
        dto.modulo = entity.getModulo() != null ? entity.getModulo().name() : null;
        dto.nivelAcceso = entity.getNivelAcceso() != null ? entity.getNivelAcceso().name() : null;
        return dto;
    }
}
