package com.teatroreal.repository.tempo;

import com.teatroreal.domain.tempo.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

<<<<<<< HEAD
@Repository
=======
@Repository("departamentoRepositoryTempo")
>>>>>>> 5f5ad938ebc041f2e716139a5623612b8f844e98
public interface DepartamentoRepository extends JpaRepository<Departamento, Long> {
}
