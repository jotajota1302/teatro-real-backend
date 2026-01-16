package com.teatroreal.repository.tempo;

import com.teatroreal.domain.tempo.Espacio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EspacioRepository extends JpaRepository<Espacio, Long> {
}
