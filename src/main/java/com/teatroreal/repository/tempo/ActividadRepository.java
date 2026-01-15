package com.teatroreal.repository.tempo;

import com.teatroreal.domain.tempo.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActividadRepository extends JpaRepository<Actividad, String> {
    List<Actividad> findByTemporada(String temporada);
    List<Actividad> findByEspacioId(Long espacioId);
    List<Actividad> findByTipoActividadId(Long tipoActividadId);
}
