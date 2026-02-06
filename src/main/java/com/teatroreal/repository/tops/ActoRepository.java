package com.teatroreal.repository.tops;

import com.teatroreal.domain.tops.Acto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActoRepository extends JpaRepository<Acto, String> {

    /**
     * Cuenta los actos de un guion
     */
    int countByGuionId(String guionId);

    /**
     * Obtiene actos de un guion ordenados
     */
    List<Acto> findByGuionIdOrderByOrdenAsc(String guionId);
}
