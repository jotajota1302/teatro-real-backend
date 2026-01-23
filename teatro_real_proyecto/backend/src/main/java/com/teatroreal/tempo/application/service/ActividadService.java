package com.teatroreal.tempo.application.service;

import com.teatroreal.tempo.application.dto.ActividadDTO;
import com.teatroreal.tempo.application.dto.CreateActividadRequest;
import com.teatroreal.tempo.infrastructure.mock.MockDataProvider;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Servicio de gestión de actividades (con datos mockeados).
 */
@Service
public class ActividadService {

    private final MockDataProvider mockDataProvider;

    public ActividadService(MockDataProvider mockDataProvider) {
        this.mockDataProvider = mockDataProvider;
    }

/**
 * Obtiene todas las actividades.
 */
public List<ActividadDTO> obtenerTodas() {
    return mockDataProvider.getActividades();
}

/**
 * Listar todas las actividades.
 */
public List<ActividadDTO> listarActividades() {
    return obtenerTodas();
}

/**
 * Obtiene una actividad por ID.
 */
public ActividadDTO obtenerPorId(String id) {
    ActividadDTO actividad = mockDataProvider.getActividadById(id);
    if (actividad == null) {
        throw new IllegalArgumentException("Actividad no encontrada: " + id);
    }
    return actividad;
}

/**
 * Obtener una actividad por ID.
 */
public ActividadDTO obtenerActividad(String id) {
    return obtenerPorId(id);
}

    /**
     * Crea una nueva actividad.
     */
    public ActividadDTO crear(CreateActividadRequest request) {
        // Validar solapamiento
        if (mockDataProvider.existsConflicto(
            request.getEspacioId(),
            request.getInicio(),
            request.getFin(),
            "")) {
            throw new IllegalArgumentException("Existe conflicto de horario en el espacio");
        }

        ActividadDTO actividad = new ActividadDTO(
            UUID.randomUUID().toString(),
            request.getTitulo(),
            request.getTipo(),
            request.getEspacioId(),
            request.getInicio(),
            request.getFin(),
            request.getCodigoColor(),
            request.getResponsable(),
            request.getDescripcion(),
            false,
            Instant.now(),
            Instant.now()
        );
        mockDataProvider.addActividad(actividad);
        return actividad;
    }

    /**
     * Obtiene actividades por espacio.
     */
    public List<ActividadDTO> obtenerPorEspacio(String espacioId) {
        return mockDataProvider.getActividadesByEspacio(espacioId);
    }

    /**
     * Actualiza una actividad existente.
     */
    public ActividadDTO actualizar(String id, CreateActividadRequest request) {
        ActividadDTO existente = obtenerPorId(id);

        // Validar solapamiento (excluyendo la actividad actual)
        if (mockDataProvider.existsConflicto(
            request.getEspacioId(),
            request.getInicio(),
            request.getFin(),
            id)) {
            throw new IllegalArgumentException("Existe conflicto de horario en el espacio");
        }

        ActividadDTO actualizada = new ActividadDTO(
            id,
            request.getTitulo(),
            request.getTipo(),
            request.getEspacioId(),
            request.getInicio(),
            request.getFin(),
            request.getCodigoColor(),
            request.getResponsable(),
            request.getDescripcion(),
            existente.isSincronizadaGoogleCalendar(),
            existente.getCreatedAt(),
            Instant.now()
        );
        mockDataProvider.updateActividad(id, actualizada);
        return actualizada;
    }

    /**
     * Elimina una actividad.
     */
    public void eliminar(String id) {
        obtenerPorId(id); // Verificar que existe
        mockDataProvider.deleteActividad(id);
    }

    /**
     * Marca una actividad como sincronizada con Google Calendar.
     */
    public ActividadDTO marcarSincronizada(String id) {
        ActividadDTO actividad = obtenerPorId(id);
        ActividadDTO actualizada = new ActividadDTO(
            id,
            actividad.getTitulo(),
            actividad.getTipo(),
            actividad.getEspacioId(),
            actividad.getInicio(),
            actividad.getFin(),
            actividad.getCodigoColor(),
            actividad.getResponsable(),
            actividad.getDescripcion(),
            true,
            actividad.getCreatedAt(),
            Instant.now()
        );
        mockDataProvider.updateActividad(id, actualizada);
        return actualizada;
    }

    /**
     * Crear una nueva actividad.
     */
    public ActividadDTO crearActividad(CreateActividadRequest request) {
        return crear(request);
    }

    /**
     * Listar actividades por espacio.
     */
    public List<ActividadDTO> listarActividadesPorEspacio(String espacioId) {
        return obtenerPorEspacio(espacioId);
    }

    /**
     * Listar actividades por responsable.
     */
    public List<ActividadDTO> listarActividadesPorResponsable(String responsable) {
        return mockDataProvider.getActividades().stream()
            .filter(a -> a.getResponsable().equalsIgnoreCase(responsable))
            .toList();
    }

    /**
     * Listar actividades por rango de fechas.
     */
    public List<ActividadDTO> listarActividadesPorRango(LocalDateTime inicio, LocalDateTime fin) {
        return mockDataProvider.getActividades().stream()
            .filter(a -> {
                LocalDateTime aInicio = a.getInicio();
                LocalDateTime aFin = a.getFin();
                return (aInicio.isAfter(inicio) || aInicio.isEqual(inicio)) &&
                       (aFin.isBefore(fin) || aFin.isEqual(fin));
            })
            .toList();
    }

    /**
     * Modificar horario de una actividad.
     */
    public ActividadDTO modificarHorario(String id, LocalDateTime nuevoInicio, LocalDateTime nuevoFin) {
        ActividadDTO existente = obtenerPorId(id);

        // Validar solapamiento (excluyendo la actividad actual)
        if (mockDataProvider.existsConflicto(
            existente.getEspacioId(),
            nuevoInicio,
            nuevoFin,
            id)) {
            throw new IllegalArgumentException("Existe conflicto de horario en el espacio");
        }

        ActividadDTO actualizada = new ActividadDTO(
            id,
            existente.getTitulo(),
            existente.getTipo(),
            existente.getEspacioId(),
            nuevoInicio,
            nuevoFin,
            existente.getCodigoColor(),
            existente.getResponsable(),
            existente.getDescripcion(),
            existente.isSincronizadaGoogleCalendar(),
            existente.getCreatedAt(),
            Instant.now()
        );
        mockDataProvider.updateActividad(id, actualizada);
        return actualizada;
    }

    /**
     * Eliminar una actividad.
     */
    public void eliminarActividad(String id) {
        eliminar(id);
    }
}
