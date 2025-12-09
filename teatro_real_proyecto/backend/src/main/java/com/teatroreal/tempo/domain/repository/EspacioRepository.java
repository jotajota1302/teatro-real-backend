package com.teatroreal.tempo.domain.repository;

import com.teatroreal.tempo.application.dto.EspacioDTO;
import java.util.List;

/**
 * Interfaz de repositorio para Espacios.
 * Implementación con datos mockeados (sin JPA).
 */
public interface EspacioRepository {
    List<EspacioDTO> findAll();
    EspacioDTO findById(String id);
    EspacioDTO save(EspacioDTO espacio);
    void delete(String id);
}
