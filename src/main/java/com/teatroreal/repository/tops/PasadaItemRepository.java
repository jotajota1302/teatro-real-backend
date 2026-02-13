package com.teatroreal.repository.tops;

import com.teatroreal.domain.tops.PasadaItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasadaItemRepository extends JpaRepository<PasadaItem, String> {

    List<PasadaItem> findByActoIdOrderByOrdenAsc(String actoId);

    @Query("SELECT COALESCE(MAX(p.orden), 0) FROM PasadaItem p WHERE p.acto.id = :actoId")
    Integer findMaxOrdenByActoId(@Param("actoId") String actoId);

    @Modifying
    @Query("UPDATE PasadaItem p SET p.orden = p.orden + 1 WHERE p.acto.id = :actoId AND p.orden >= :fromOrden")
    void incrementOrdenFrom(@Param("actoId") String actoId, @Param("fromOrden") Integer fromOrden);

    void deleteByActoId(String actoId);
}
