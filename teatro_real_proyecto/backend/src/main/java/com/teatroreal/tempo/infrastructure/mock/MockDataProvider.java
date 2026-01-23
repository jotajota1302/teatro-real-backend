package com.teatroreal.tempo.infrastructure.mock;

import com.teatroreal.tempo.application.dto.ActividadDTO;
import com.teatroreal.tempo.application.dto.EspacioDTO;
import com.teatroreal.tempo.domain.model.TipoActividad;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Proveedor de datos mockeados para la aplicación.
 * Simula una base de datos en memoria.
 */
@Component
public class MockDataProvider {

    private static final List<EspacioDTO> espacios = new ArrayList<>();
    private static final List<ActividadDTO> actividades = new ArrayList<>();

    static {
        // Inicializar espacios
        espacios.add(new EspacioDTO(
            UUID.randomUUID().toString(),
            "Sala Principal",
            "Sala de conciertos",
            "Planta Principal",
            "#E74C3C",
            true,
            Instant.now(),
            Instant.now()
        ));

        espacios.add(new EspacioDTO(
            UUID.randomUUID().toString(),
            "Sala Cámara",
            "Sala de cámara",
            "Planta 1",
            "#3498DB",
            true,
            Instant.now(),
            Instant.now()
        ));

        espacios.add(new EspacioDTO(
            UUID.randomUUID().toString(),
            "Estudio A",
            "Estudio de ensayo",
            "Planta 2",
            "#2ECC71",
            true,
            Instant.now(),
            Instant.now()
        ));

        espacios.add(new EspacioDTO(
            UUID.randomUUID().toString(),
            "Estudio B",
            "Estudio de ensayo",
            "Planta 2",
            "#F39C12",
            true,
            Instant.now(),
            Instant.now()
        ));

        espacios.add(new EspacioDTO(
            UUID.randomUUID().toString(),
            "Foyer",
            "Sala de espera",
            "Planta Baja",
            "#9B59B6",
            true,
            Instant.now(),
            Instant.now()
        ));

        espacios.add(new EspacioDTO(
            UUID.randomUUID().toString(),
            "Cafetería",
            "Área de descanso",
            "Planta Baja",
            "#1ABC9C",
            true,
            Instant.now(),
            Instant.now()
        ));

        // Inicializar actividades
        LocalDateTime ahora = LocalDateTime.now();
        Instant ahoraInstant = Instant.now();

        actividades.add(new ActividadDTO(
            UUID.randomUUID().toString(),
            "La Traviata",
            TipoActividad.FUNCION,
            espacios.get(0).getId(),
            ahora,
            ahora.plusHours(2),
            "#E74C3C",
            "María García",
            "Ópera de Verdi",
            false,
            ahoraInstant,
            ahoraInstant
        ));

        actividades.add(new ActividadDTO(
            UUID.randomUUID().toString(),
            "Ensayo Orquesta",
            TipoActividad.ENSAYO,
            espacios.get(0).getId(),
            ahora.plusDays(1),
            ahora.plusDays(1).plusHours(3),
            "#3498DB",
            "Juan López",
            "Ensayo general",
            false,
            ahoraInstant,
            ahoraInstant
        ));

        actividades.add(new ActividadDTO(
            UUID.randomUUID().toString(),
            "Mantenimiento Iluminación",
            TipoActividad.MANTENIMIENTO,
            espacios.get(1).getId(),
            ahora.plusDays(2),
            ahora.plusDays(2).plusHours(1),
            "#2ECC71",
            "Carlos Sánchez",
            "Revisión de equipos",
            false,
            ahoraInstant,
            ahoraInstant
        ));

        actividades.add(new ActividadDTO(
            UUID.randomUUID().toString(),
            "El Quijote",
            TipoActividad.FUNCION,
            espacios.get(1).getId(),
            ahora.plusDays(3),
            ahora.plusDays(3).plusHours(2),
            "#F39C12",
            "María García",
            "Drama clásico",
            false,
            ahoraInstant,
            ahoraInstant
        ));

        actividades.add(new ActividadDTO(
            UUID.randomUUID().toString(),
            "Preparación Escenario",
            TipoActividad.PREPARACION,
            espacios.get(0).getId(),
            ahora.plusDays(4),
            ahora.plusDays(4).plusHours(4),
            "#9B59B6",
            "Equipo técnico",
            "Montaje escenografía",
            false,
            ahoraInstant,
            ahoraInstant
        ));
    }

    public List<EspacioDTO> getEspacios() {
        return new ArrayList<>(espacios);
    }

    public EspacioDTO getEspacioById(String id) {
        return espacios.stream()
            .filter(e -> e.getId().equals(id))
            .findFirst()
            .orElse(null);
    }

    public void addEspacio(EspacioDTO espacio) {
        espacios.add(espacio);
    }

    public void updateEspacio(String id, EspacioDTO espacio) {
        int index = espacios.stream()
            .map(EspacioDTO::getId)
            .toList()
            .indexOf(id);
        if (index >= 0) {
            espacios.set(index, espacio);
        }
    }

    public void deleteEspacio(String id) {
        espacios.removeIf(e -> e.getId().equals(id));
    }

    public List<ActividadDTO> getActividades() {
        return new ArrayList<>(actividades);
    }

    public ActividadDTO getActividadById(String id) {
        return actividades.stream()
            .filter(a -> a.getId().equals(id))
            .findFirst()
            .orElse(null);
    }

    public List<ActividadDTO> getActividadesByEspacio(String espacioId) {
        return actividades.stream()
            .filter(a -> a.getEspacioId().equals(espacioId))
            .toList();
    }

    public void addActividad(ActividadDTO actividad) {
        actividades.add(actividad);
    }

    public void updateActividad(String id, ActividadDTO actividad) {
        int index = actividades.stream()
            .map(ActividadDTO::getId)
            .toList()
            .indexOf(id);
        if (index >= 0) {
            actividades.set(index, actividad);
        }
    }

    public void deleteActividad(String id) {
        actividades.removeIf(a -> a.getId().equals(id));
    }

    public boolean existsConflicto(String espacioId, LocalDateTime inicio, LocalDateTime fin, String excludeId) {
        return actividades.stream()
            .filter(a -> !a.getId().equals(excludeId))
            .filter(a -> a.getEspacioId().equals(espacioId))
            .anyMatch(a -> {
                LocalDateTime aInicio = a.getInicio();
                LocalDateTime aFin = a.getFin();
                return (inicio.isBefore(aFin) && fin.isAfter(aInicio));
            });
    }
}
