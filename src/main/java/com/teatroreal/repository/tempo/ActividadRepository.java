package com.teatroreal.repository.tempo;

import com.teatroreal.domain.tempo.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, String>, JpaSpecificationExecutor<Actividad> {
    List<Actividad> findByTemporada_Id(Long temporadaId);
    List<Actividad> findByTipoActividad_Id(String tipoActividadId);
    List<Actividad> findByEspacio_Id(Long espacioId);
    List<Actividad> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin);
    List<Actividad> findByTemporada_IdAndFechaBetween(Long temporadaId, LocalDate fechaInicio, LocalDate fechaFin);

    // Logística: operaciones en espacios tipo ALMACEN
    @Query("SELECT a FROM Actividad a WHERE a.espacio.tipo = 'ALMACEN' ORDER BY a.fecha DESC, a.horaInicio DESC")
    List<Actividad> findOperacionesAlmacen();

    @Query("SELECT a FROM Actividad a WHERE a.espacio.tipo = 'ALMACEN' AND a.fecha BETWEEN :inicio AND :fin ORDER BY a.fecha, a.horaInicio")
    List<Actividad> findOperacionesAlmacenByFechaBetween(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);

    @Query("SELECT a FROM Actividad a WHERE a.espacio.tipo = 'ALMACEN' AND a.temporada.id = :temporadaId ORDER BY a.fecha DESC")
    List<Actividad> findOperacionesAlmacenByTemporada(@Param("temporadaId") Long temporadaId);

    // Contar por estado (para estadísticas)
    @Query("SELECT COUNT(a) FROM Actividad a WHERE a.espacio.tipo = 'ALMACEN' AND a.estado = :estado")
    long countByEspacioTipoAlmacenAndEstado(@Param("estado") Actividad.EstadoActividad estado);

    // Contar camiones hoy
    @Query("SELECT COALESCE(SUM(a.numCamiones), 0) FROM Actividad a WHERE a.espacio.tipo = 'ALMACEN' AND a.fecha = :fecha")
    int countCamionesHoy(@Param("fecha") LocalDate fecha);
}
