package com.teatroreal.repository.tempo;

import com.teatroreal.domain.tempo.TipoActividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TipoActividadRepository extends JpaRepository<TipoActividad, String> {
    Optional<TipoActividad> findByNombreIgnoreCase(String nombre);
    boolean existsByNombreIgnoreCase(String nombre);
}
