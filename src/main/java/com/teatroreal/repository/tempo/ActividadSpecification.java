package com.teatroreal.repository.tempo;

import com.teatroreal.domain.tempo.Actividad;
import com.teatroreal.dto.request.ActividadFiltrosRequest;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

/**
 * Specification para construir queries dinámicas de Actividad
 * basadas en los filtros proporcionados
 */
public class ActividadSpecification {

    /**
     * Construye una Specification dinámica basada en los filtros proporcionados
     */
    public static Specification<Actividad> conFiltros(ActividadFiltrosRequest filtros) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filtro por espacios (IDs múltiples)
            if (filtros.getEspacioIds() != null && !filtros.getEspacioIds().isEmpty()) {
                predicates.add(root.get("espacio").get("id").in(filtros.getEspacioIds()));
            }

            // Filtro por nombre del espectáculo (búsqueda parcial, case-insensitive)
            if (filtros.getNombreEspectaculo() != null && !filtros.getNombreEspectaculo().trim().isEmpty()) {
                String patron = "%" + filtros.getNombreEspectaculo().trim().toLowerCase() + "%";
                predicates.add(
                    criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("titulo")), patron),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("descripcion")), patron),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("produccionNombre")), patron)
                    )
                );
            }

            // Filtro por tipos de actividad (IDs múltiples)
            if (filtros.getTipoActividadIds() != null && !filtros.getTipoActividadIds().isEmpty()) {
                predicates.add(root.get("tipoActividad").get("id").in(filtros.getTipoActividadIds()));
            }

            // Filtro por cursos
            if (filtros.getEsCurso() != null) {
                // Asumiendo que hay un campo boolean esCurso en Actividad
                // Si no existe, puedes usar una convención como tipo.nombre.contains("Curso")
                Predicate cursoPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("tipoActividad").get("nombre")), 
                    "%curso%"
                );
                if (filtros.getEsCurso()) {
                    predicates.add(cursoPredicate);
                } else {
                    predicates.add(criteriaBuilder.not(cursoPredicate));
                }
            }

            // Filtro por visitas
            if (filtros.getEsVisita() != null) {
                Predicate visitaPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("tipoActividad").get("nombre")), 
                    "%visita%"
                );
                if (filtros.getEsVisita()) {
                    predicates.add(visitaPredicate);
                } else {
                    predicates.add(criteriaBuilder.not(visitaPredicate));
                }
            }

            // Filtro por temporada
            if (filtros.getTemporadaId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("temporada").get("id"), filtros.getTemporadaId()));
            }

            // Filtro por semana (rango de 7 días)
            if (filtros.getSemanaInicio() != null && filtros.getSemanaFin() != null) {
                predicates.add(criteriaBuilder.between(
                    root.get("fecha"),
                    filtros.getSemanaInicio(),
                    filtros.getSemanaFin()
                ));
            }

            // Filtro por mes y año específicos
            if (filtros.getMes() != null && filtros.getAnio() != null) {
                YearMonth yearMonth = YearMonth.of(filtros.getAnio(), filtros.getMes());
                LocalDate primerDia = yearMonth.atDay(1);
                LocalDate ultimoDia = yearMonth.atEndOfMonth();
                predicates.add(criteriaBuilder.between(
                    root.get("fecha"),
                    primerDia,
                    ultimoDia
                ));
            }

            // Filtro por día específico
            if (filtros.getDia() != null) {
                predicates.add(criteriaBuilder.equal(root.get("fecha"), filtros.getDia()));
            }

            // Filtro por rango de fechas general (si no se usó semana/mes/día)
            if (filtros.getFechaInicio() != null && filtros.getFechaFin() != null &&
                filtros.getSemanaInicio() == null && filtros.getDia() == null && 
                (filtros.getMes() == null || filtros.getAnio() == null)) {
                predicates.add(criteriaBuilder.between(
                    root.get("fecha"),
                    filtros.getFechaInicio(),
                    filtros.getFechaFin()
                ));
            } else if (filtros.getFechaInicio() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("fecha"), filtros.getFechaInicio()));
            } else if (filtros.getFechaFin() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("fecha"), filtros.getFechaFin()));
            }

            // Filtro por estado
            if (filtros.getEstado() != null && !filtros.getEstado().trim().isEmpty()) {
                try {
                    Actividad.EstadoActividad estado = Actividad.EstadoActividad.valueOf(filtros.getEstado());
                    predicates.add(criteriaBuilder.equal(root.get("estado"), estado));
                } catch (IllegalArgumentException e) {
                    // Estado inválido, ignorar
                }
            }

            // Filtro por departamento
            if (filtros.getDepartamentoId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("departamento").get("id"), filtros.getDepartamentoId()));
            }

            // Ordenamiento por fecha y hora por defecto
            query.orderBy(
                criteriaBuilder.asc(root.get("fecha")),
                criteriaBuilder.asc(root.get("horaInicio"))
            );

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
