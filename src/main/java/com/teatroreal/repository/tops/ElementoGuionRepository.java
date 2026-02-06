package com.teatroreal.repository.tops;

import com.teatroreal.domain.tops.ElementoGuion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository para ElementoGuion
 * Proporciona operaciones CRUD y queries personalizadas
 */
@Repository
public interface ElementoGuionRepository extends JpaRepository<ElementoGuion, String> {

    /**
     * Encuentra todos los elementos de una escena, ordenados por campo orden
     *
     * @param escenaId ID de la escena
     * @return Lista ordenada de elementos
     */
    @Query("SELECT e FROM ElementoGuion e WHERE e.escena.id = :escenaId ORDER BY e.orden ASC")
    List<ElementoGuion> findByEscenaIdOrderByOrden(@Param("escenaId") String escenaId);

    /**
     * Encuentra todos los elementos de un guion, ordenados por orden
     * Navega a través de escena -> acto -> guion
     *
     * @param guionId ID del guion
     * @return Lista ordenada de elementos
     */
    @Query("SELECT e FROM ElementoGuion e WHERE e.escena.acto.guion.id = :guionId ORDER BY e.orden ASC")
    List<ElementoGuion> findByGuionIdOrderByOrden(@Param("guionId") String guionId);

    /**
     * Encuentra elementos por tipo dentro de una escena
     *
     * @param escenaId ID de la escena
     * @param tipoElemento Tipo de elemento
     * @return Lista de elementos del tipo especificado
     */
    @Query("SELECT e FROM ElementoGuion e WHERE e.escena.id = :escenaId AND e.tipoElemento = :tipoElemento ORDER BY e.orden")
    List<ElementoGuion> findByEscenaAndTipo(
            @Param("escenaId") String escenaId,
            @Param("tipoElemento") ElementoGuion.TipoElemento tipoElemento
    );

    /**
     * Cuenta elementos de una escena
     *
     * @param escenaId ID de la escena
     * @return Cantidad de elementos
     */
    @Query("SELECT COUNT(e) FROM ElementoGuion e WHERE e.escena.id = :escenaId")
    long countByEscenaId(@Param("escenaId") String escenaId);

    /**
     * Encuentra elementos por número de TOP
     *
     * @param numeroTop Número del TOP
     * @return Lista de elementos con ese número TOP
     */
    List<ElementoGuion> findByNumeroTop(String numeroTop);

    /**
     * Cuenta elementos con un número TOP específico en un guion, excluyendo un elemento
     * Usado para validar unicidad de TOPs
     *
     * @param numeroTop Número del TOP
     * @param guionId ID del guion
     * @param excludeElementoId ID del elemento a excluir (típicamente para updates)
     * @return Cantidad de elementos que coinciden
     */
    @Query("SELECT COUNT(e) FROM ElementoGuion e WHERE e.numeroTop = :numeroTop AND e.escena.acto.guion.id = :guionId AND e.id != :excludeElementoId")
    long countByNumeroTopAndGuionIdExcluding(
            @Param("numeroTop") String numeroTop,
            @Param("guionId") String guionId,
            @Param("excludeElementoId") String excludeElementoId
    );
}
