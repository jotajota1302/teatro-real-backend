package com.teatroreal.dto.request;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class OrdenUpdateRequest {
    private List<OrdenItem> items;

    @Getter
    @Setter
    public static class OrdenItem {
        private String id;
        private Integer orden;
    }
}
