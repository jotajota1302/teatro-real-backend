package com.teatroreal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogisticaSummaryResponse {
    private int programados;
    private int enTransito;
    private int completados;
    private int camionesHoy;
}
