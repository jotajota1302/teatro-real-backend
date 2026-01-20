package com.teatroreal.repository.tops;

import com.teatroreal.domain.tops.Acto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActoRepository extends JpaRepository<Acto, String> {
    // Métodos custom si son necesarios...
}
