package com.teatroreal.repository.tops;

import com.teatroreal.domain.tops.Guion;
import com.teatroreal.domain.tops.Guion.EstadoGuion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuionRepository extends JpaRepository<Guion, String> {

    List<Guion> findByTemporadaOrderByProduccionNombreAsc(String temporada);
    List<Guion> findByProduccionNombreContainingIgnoreCaseOrderByProduccionNombreAsc(String produccionNombre);
    List<Guion> findByTemporadaAndProduccionNombreContainingIgnoreCaseOrderByProduccionNombreAsc(String temporada, String produccionNombre);

    List<Guion> findByEstadoOrderByUpdatedAtDesc(EstadoGuion estado);

    @Query("SELECT g FROM Guion g WHERE g.temporada = :temporada ORDER BY g.produccionNombre")
    List<Guion> findAllByTemporada(@Param("temporada") String temporada);

    @Query("SELECT g FROM Guion g LEFT JOIN FETCH g.actos WHERE g.id = :id")
    Optional<Guion> findByIdWithActos(@Param("id") String id);

    // Guion completo con todo el árbol (para editor)
    @Query("SELECT DISTINCT g FROM Guion g " +
           "LEFT JOIN FETCH g.actos a " +
           "LEFT JOIN FETCH a.pasadaItems " +
           "LEFT JOIN FETCH a.escenas e " +
           "LEFT JOIN FETCH e.elementos " +
           "WHERE g.id = :id")
    Optional<Guion> findByIdCompleto(@Param("id") String id);

    // Verificar si existe guion para producción/temporada
    boolean existsByProduccionNombreAndTemporada(String produccionNombre, String temporada);

    // Buscar guiones bloqueados por un usuario
    @Query("SELECT g FROM Guion g WHERE g.lockedBy.id = :userId")
    List<Guion> findLockedByUsuario(@Param("userId") String userId);

    // Contar TOPs en un guion (query optimizada)
    @Query("SELECT COUNT(e) FROM ElementoGuion e " +
           "WHERE e.tipoElemento = 'TOP' AND e.escena.acto.guion.id = :guionId")
    Long countTopsByGuionId(@Param("guionId") String guionId);
}
