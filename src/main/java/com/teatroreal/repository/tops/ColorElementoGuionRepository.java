package com.teatroreal.repository.tops;

import com.teatroreal.domain.tops.ColorElementoGuion;
import com.teatroreal.domain.tops.ElementoGuion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColorElementoGuionRepository extends JpaRepository<ColorElementoGuion, Long> {
    boolean existsByTipoElemento(ElementoGuion.TipoElemento tipoElemento);
    ColorElementoGuion findByTipoElemento(ElementoGuion.TipoElemento tipoElemento);
}
