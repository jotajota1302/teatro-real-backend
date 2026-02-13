package com.teatroreal.repository.tops;

import com.teatroreal.domain.tops.Escena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EscenaRepository extends JpaRepository<Escena, String> {
    // Métodos custom si son necesarios...
}
