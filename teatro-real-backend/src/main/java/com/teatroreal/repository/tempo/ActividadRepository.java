package com.teatroreal.repository.tempo;

import com.teatroreal.domain.tempo.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, String> {
<<<<<<< HEAD
    List<Actividad> findByTemporadaId(String temporadaId);
    List<Actividad> findByTipoActividadId(String tipoActividadId);
    List<Actividad> findByEspacioId(String espacioId);
    List<Actividad> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin);
    List<Actividad> findByTemporadaIdAndFechaBetween(String temporadaId, LocalDate fechaInicio, LocalDate fechaFin);
=======
    List<Actividad> findByTemporada_Id(Long temporadaId);
    List<Actividad> findByTipoActividad_Id(String tipoActividadId);
    List<Actividad> findByEspacio_Id(Long espacioId);
    List<Actividad> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin);
    List<Actividad> findByTemporada_IdAndFechaBetween(Long temporadaId, LocalDate fechaInicio, LocalDate fechaFin);
>>>>>>> 5f5ad938ebc041f2e716139a5623612b8f844e98
}
