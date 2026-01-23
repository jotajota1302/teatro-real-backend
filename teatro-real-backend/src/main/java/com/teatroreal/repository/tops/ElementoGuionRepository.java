package com.teatroreal.repository.tops;

import com.teatroreal.domain.tops.ElementoGuion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ElementoGuionRepository extends JpaRepository<ElementoGuion, String> {
    // Métodos custom si son necesarios...
}
