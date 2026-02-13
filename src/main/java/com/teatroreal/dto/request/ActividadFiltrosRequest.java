package com.teatroreal.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO para filtros multidimensionales de actividades
 * Soporta búsqueda avanzada por múltiples criterios
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActividadFiltrosRequest {
    
    /**
     * Lista de IDs de espacios/salas para filtrar
     */
    private List<Long> espacioIds;
    
    /**
     * Búsqueda parcial por nombre del espectáculo o género
     */
    private String nombreEspectaculo;
    
    /**
     * Lista de IDs de tipos de actividad
     */
    private List<Long> tipoActividadIds;
    
    /**
     * Filtro por actividades que son cursos
     */
    private Boolean esCurso;
    
    /**
     * Filtro por actividades que son visitas
     */
    private Boolean esVisita;
    
    /**
     * ID de temporada para filtrar
     */
    private Long temporadaId;
    
    /**
     * Fecha de inicio de semana (para vista semanal)
     */
    private LocalDate semanaInicio;
    
    /**
     * Fecha de fin de semana (para vista semanal)
     */
    private LocalDate semanaFin;
    
    /**
     * Mes específico (1-12)
     */
    private Integer mes;
    
    /**
     * Año específico
     */
    private Integer anio;
    
    /**
     * Día específico para filtrar
     */
    private LocalDate dia;
    
    /**
     * Fecha de inicio general (alternativa a semana/mes/día)
     */
    private LocalDate fechaInicio;
    
    /**
     * Fecha de fin general (alternativa a semana/mes/día)
     */
    private LocalDate fechaFin;
    
    /**
     * Estado de la actividad
     */
    private String estado;
    
    /**
     * ID del departamento responsable
     */
    private Long departamentoId;
}
