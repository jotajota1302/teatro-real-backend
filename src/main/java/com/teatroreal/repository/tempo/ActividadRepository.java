package com.teatroreal.repository.tempo;

import com.teatroreal.domain.tempo.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, String> {
    List<Actividad> findByTemporada_Id(Long temporadaId);
    List<Actividad> findByTipoActividad_Id(String tipoActividadId);
    List<Actividad> findByEspacio_Id(Long espacioId);
    List<Actividad> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin);
    List<Actividad> findByTemporada_IdAndFechaBetween(Long temporadaId, LocalDate fechaInicio, LocalDate fechaFin);
}
