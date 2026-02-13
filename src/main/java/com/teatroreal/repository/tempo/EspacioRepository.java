package com.teatroreal.repository.tempo;

import com.teatroreal.domain.tempo.Espacio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EspacioRepository extends JpaRepository<Espacio, Long> {
    List<Espacio> findByTipo(String tipo);
    List<Espacio> findByActivoTrue();
    List<Espacio> findByTipoAndActivoTrue(String tipo);
}
