package com.teatroreal.repository;

import com.teatroreal.entity.Espacio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EspacioRepository extends JpaRepository<Espacio, Long> {

    List<Espacio> findByActivoTrue();

    List<Espacio> findByTipo(String tipo);

    List<Espacio> findByNombreContainingIgnoreCase(String nombre);
}
