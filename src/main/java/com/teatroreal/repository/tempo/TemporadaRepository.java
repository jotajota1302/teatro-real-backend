package com.teatroreal.repository.tempo;

import com.teatroreal.domain.tempo.Temporada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

<<<<<<< HEAD
@Repository
public interface TemporadaRepository extends JpaRepository<Temporada, String> {
=======
@Repository("temporadaRepositoryTempo")
public interface TemporadaRepository extends JpaRepository<Temporada, Long> {
>>>>>>> 5f5ad938ebc041f2e716139a5623612b8f844e98
}
