package com.teatroreal.tempo.domain.repository;

import com.teatroreal.tempo.application.dto.ActividadDTO;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Interfaz de repositorio para Actividades.
 * Implementación con datos mockeados (sin JPA).
 */
public interface ActividadRepository {
    List<ActividadDTO> findAll();
    ActividadDTO findById(String id);
    ActividadDTO save(ActividadDTO actividad);
    void delete(String id);
    List<ActividadDTO> findByEspacioId(String espacioId);
    List<ActividadDTO> findByResponsable(String responsable);
    List<ActividadDTO> findConflictingActivities(String espacioId, LocalDateTime inicio, LocalDateTime fin);
}
