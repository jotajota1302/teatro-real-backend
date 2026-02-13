package com.teatroreal.dto.response;

import com.teatroreal.domain.tops.Acto;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ActoResponse {
    private String id;
    private String nombre;
    private Integer orden;
    private String guionId;

    public static ActoResponse fromEntity(Acto acto) {
        return ActoResponse.builder()
                .id(acto.getId())
                .nombre(acto.getNombre())
                .orden(acto.getOrden())
                .guionId(acto.getGuion() != null ? acto.getGuion().getId() : null)
                .build();
    }
}
