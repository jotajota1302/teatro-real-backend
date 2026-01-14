package com.teatroreal.repository.tempo;

import com.teatroreal.domain.tempo.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, String> {
    List<Actividad> findByTemporadaId(String temporadaId);
    List<Actividad> findByTipoActividadId(String tipoActividadId);
    List<Actividad> findByEspacioId(String espacioId);
    List<Actividad> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin);
    List<Actividad> findByTemporadaIdAndFechaBetween(String temporadaId, LocalDate fechaInicio, LocalDate fechaFin);
}
