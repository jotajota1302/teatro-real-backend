package com.teatroreal.repository.tempo;

import com.teatroreal.domain.tempo.Temporada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TemporadaRepository extends JpaRepository<Temporada, Long> {

    Optional<Temporada> findByActivaTrue();

    Optional<Temporada> findByNombre(String nombre);

    boolean existsByNombreIgnoreCase(String nombre);
}
