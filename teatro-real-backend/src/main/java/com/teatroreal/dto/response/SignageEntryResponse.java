package com.teatroreal.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class SignageEntryResponse {
    private Long espacioId;
    private String espacioNombre;
    private List<ActividadSignage> actividades;

    @Data
    @Builder
    public static class ActividadSignage {
        private String id;
        private String descripcion;
        private String fecha;
        private String estado;
    }
}
