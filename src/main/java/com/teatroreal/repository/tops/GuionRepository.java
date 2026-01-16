package com.teatroreal.repository.tops;

import com.teatroreal.domain.tops.Guion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GuionRepository extends JpaRepository<Guion, String> {
    // Métodos custom si son necesarios...
}
