package com.teatroreal.repository.tops;

import com.teatroreal.domain.tops.GuionImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA para GuionImage
 * Consultas para gestionar imágenes de guiones
 */
@Repository
public interface GuionImageRepository extends JpaRepository<GuionImage, Long> {

    /**
     * Obtiene todas las imágenes de una entidad específica
     */
    List<GuionImage> findByEntityTypeAndEntityId(String entityType, Long entityId);

    /**
     * Obtiene todas las imágenes de un guion
     */
    List<GuionImage> findByGuionId(Long guionId);

    /**
     * Obtiene todas las imágenes de una entidad en un guion específico
     */
    List<GuionImage> findByGuionIdAndEntityTypeAndEntityId(Long guionId, String entityType, Long entityId);

    /**
     * Elimina todas las imágenes de una entidad
     */
    long deleteByEntityTypeAndEntityId(String entityType, Long entityId);

    /**
     * Elimina todas las imágenes de un guion
     */
    long deleteByGuionId(Long guionId);
}
