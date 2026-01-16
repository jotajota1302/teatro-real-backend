package com.teatroreal.repository.tempo;

import com.teatroreal.domain.tempo.Temporada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("temporadaRepositoryTempo")
public interface TemporadaRepository extends JpaRepository<Temporada, Long> {
}
