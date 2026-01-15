package com.teatroreal.repository.tempo;

import com.teatroreal.domain.tempo.TipoActividad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TipoActividadRepository extends JpaRepository<TipoActividad, Long> {
    Optional<TipoActividad> findByNombre(String nombre);
}
