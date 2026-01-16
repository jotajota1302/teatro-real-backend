package com.teatroreal.repository.tempo;

import com.teatroreal.domain.tempo.Espacio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
<<<<<<< HEAD
public interface EspacioRepository extends JpaRepository<Espacio, String> {
=======
public interface EspacioRepository extends JpaRepository<Espacio, Long> {
>>>>>>> 5f5ad938ebc041f2e716139a5623612b8f844e98
}
