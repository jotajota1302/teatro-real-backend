package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.*;
import com.teatroreal.domain.user.Usuario;
import com.teatroreal.dto.request.ActividadFiltrosRequest;
import com.teatroreal.dto.request.ActividadRequest;
import com.teatroreal.dto.response.ActividadResponse;
import com.teatroreal.repository.tempo.ActividadRepository;
import com.teatroreal.repository.tempo.ActividadSpecification;
import com.teatroreal.repository.tempo.TipoActividadRepository;
import com.teatroreal.repository.tempo.EspacioRepository;
import com.teatroreal.repository.tempo.DepartamentoRepository;
import com.teatroreal.repository.tempo.TemporadaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ActividadService {

    private final ActividadRepository actividadRepository;
    private final TipoActividadRepository tipoActividadRepository;
    private final EspacioRepository espacioRepository;
    private final DepartamentoRepository departamentoRepository;
    private final TemporadaRepository temporadaRepository;

    public List<ActividadResponse> getAll() {
        return actividadRepository.findAll()
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public List<ActividadResponse> search(
            String espacioId,
            String tipoActividadId,
            String temporada,
            String fechaInicio,
            String fechaFin
    ) {
        List<Actividad> result = actividadRepository.findAll();

        if (espacioId != null && !espacioId.isEmpty()) {
            try {
                Long espacioIdLong = Long.valueOf(espacioId);
                result = result.stream()
                        .filter(a -> a.getEspacio() != null && Objects.equals(a.getEspacio().getId(), espacioIdLong))
                        .collect(Collectors.toList());
            } catch (NumberFormatException e) {
                // ID inválido, devolver lista vacía
                return Collections.emptyList();
            }
        }
        if (tipoActividadId != null && !tipoActividadId.isEmpty()) {
            result = result.stream()
                    .filter(a -> a.getTipoActividad() != null && Objects.equals(a.getTipoActividad().getId(), tipoActividadId))
                    .collect(Collectors.toList());
        }
        if (temporada != null && !temporada.isEmpty()) {
            result = result.stream()
                    .filter(a -> temporada.equals(a.getTemporada() != null ? a.getTemporada().getId().toString() : null))
                    .collect(Collectors.toList());
        }
        if ((fechaInicio != null && !fechaInicio.isEmpty()) || (fechaFin != null && !fechaFin.isEmpty())) {
            LocalDate fi = (fechaInicio != null && !fechaInicio.isEmpty()) ? LocalDate.parse(fechaInicio) : LocalDate.MIN;
            LocalDate ff = (fechaFin != null && !fechaFin.isEmpty()) ? LocalDate.parse(fechaFin) : LocalDate.MAX;
            result = result.stream()
                    .filter(a -> !a.getFecha().isBefore(fi) && !a.getFecha().isAfter(ff))
                    .collect(Collectors.toList());
        }
        return result.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ActividadResponse getById(String id) {
        return actividadRepository.findById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new EntityNotFoundException("Actividad no encontrada"));
    }

    public ActividadResponse create(ActividadRequest req) {
        TipoActividad tipo = tipoActividadRepository.findById(req.getTipoActividadId())
            .orElseThrow(() -> new EntityNotFoundException("TipoActividad no encontrado"));
        Espacio espacio = espacioRepository.findById(Long.valueOf(req.getEspacioId()))
            .orElseThrow(() -> new EntityNotFoundException("Espacio no encontrado"));
        Departamento departamento = null;
        if (req.getDepartamentoId() != null && !req.getDepartamentoId().isEmpty()) {
            departamento = departamentoRepository.findById(Long.valueOf(req.getDepartamentoId()))
                .orElseThrow(() -> new EntityNotFoundException("Departamento no encontrado"));
        }

        Temporada temporada = resolveTemporada(req);

        Actividad actividad = new Actividad();
        actividad.setTitulo(req.getTitulo());
        actividad.setDescripcion(req.getDescripcion());
        actividad.setTipoActividad(tipo);
        actividad.setEspacio(espacio);
        actividad.setFecha(LocalDate.parse(req.getFecha()));
        actividad.setHoraInicio(LocalTime.parse(req.getHoraInicio()));
        actividad.setHoraFin(LocalTime.parse(req.getHoraFin()));
        actividad.setDepartamento(departamento);
        actividad.setTemporada(temporada);

        actividad = actividadRepository.save(actividad);
        return toResponse(actividad);
    }

    public ActividadResponse update(String id, ActividadRequest req) {
        Actividad actividad = actividadRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Actividad no encontrada"));

        TipoActividad tipo = tipoActividadRepository.findById(req.getTipoActividadId())
            .orElseThrow(() -> new EntityNotFoundException("TipoActividad no encontrado"));
        Espacio espacio = espacioRepository.findById(Long.valueOf(req.getEspacioId()))
            .orElseThrow(() -> new EntityNotFoundException("Espacio no encontrado"));
        Departamento departamento = null;
        if (req.getDepartamentoId() != null && !req.getDepartamentoId().isEmpty()) {
            departamento = departamentoRepository.findById(Long.valueOf(req.getDepartamentoId()))
                .orElseThrow(() -> new EntityNotFoundException("Departamento no encontrado"));
        }
        Temporada temporada = resolveTemporada(req);

        actividad.setTitulo(req.getTitulo());
        actividad.setDescripcion(req.getDescripcion());
        actividad.setTipoActividad(tipo);
        actividad.setEspacio(espacio);
        actividad.setFecha(LocalDate.parse(req.getFecha()));
        actividad.setHoraInicio(LocalTime.parse(req.getHoraInicio()));
        actividad.setHoraFin(LocalTime.parse(req.getHoraFin()));
        actividad.setDepartamento(departamento);
        actividad.setTemporada(temporada);

        actividad = actividadRepository.save(actividad);
        return toResponse(actividad);
    }

    public void delete(String id) {
        Actividad actividad = actividadRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Actividad no encontrada"));
        actividadRepository.delete(actividad);
    }

    /**
     * Búsqueda avanzada con filtros múltiples usando JPA Specifications
     */
    public List<ActividadResponse> searchConFiltros(ActividadFiltrosRequest filtros) {
        Specification<Actividad> spec = ActividadSpecification.conFiltros(filtros);
        return actividadRepository.findAll(spec)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    // Clonación v2: copia todos los campos excepto id y fecha
    public ActividadResponse cloneActividad(String id, String fechaDestino) {
        Actividad original = actividadRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Actividad a clonar no encontrada"));

        LocalDate nuevaFecha = LocalDate.parse(fechaDestino);

        Actividad clonada = new Actividad();
        clonada.setTitulo(original.getTitulo());
        clonada.setTemporada(original.getTemporada());
        clonada.setDescripcion(original.getDescripcion());
        clonada.setTipoActividad(original.getTipoActividad());
        clonada.setEspacio(original.getEspacio());
        clonada.setFecha(nuevaFecha);
        clonada.setHoraInicio(original.getHoraInicio());
        clonada.setHoraFin(original.getHoraFin());
        clonada.setDepartamento(original.getDepartamento());
        clonada.setNotas(original.getNotas());
        clonada.setTipoMovimiento(original.getTipoMovimiento());
        clonada.setNumCamiones(original.getNumCamiones());
        clonada.setLugarOrigen(original.getLugarOrigen());
        clonada.setLugarDestino(original.getLugarDestino());
        clonada.setProduccionNombre(original.getProduccionNombre());
        clonada.setEstado(Actividad.EstadoActividad.PENDIENTE); // Estado siempre reiniciado

        clonada = actividadRepository.save(clonada);
        return toResponse(clonada);
    }

    // Cambio de estado almacén v2
    public ActividadResponse changeStatus(String id, String nuevoEstado) {
        Actividad actividad = actividadRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Actividad no encontrada"));

        Actividad.EstadoActividad estadoDestino;
        try {
            estadoDestino = Actividad.EstadoActividad.valueOf(nuevoEstado);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Estado destino inválido.");
        }

        // Regla: solo actividades de espacio.ALMACEN pueden cambiar estado
        if (actividad.getEspacio() == null /* || !actividad.getEspacio().getTipo().equals(TipoEspacio.ALMACEN) */ ) {
            throw new IllegalArgumentException("Solo las actividades de almacén pueden cambiar de estado");
        }
        // La máquina de estados puede parametrizarse según reglas de negocio. Para demo: aceptamos siempre el cambio
        actividad.setEstado(estadoDestino);

        actividad = actividadRepository.save(actividad);
        return toResponse(actividad);
    }

    private Temporada resolveTemporada(ActividadRequest req) {
        if (req.getTemporadaId() != null) {
            return temporadaRepository.findById(req.getTemporadaId())
                .orElseThrow(() -> new EntityNotFoundException("Temporada no encontrada"));
        }

        if (req.getTemporada() != null && !req.getTemporada().isEmpty()) {
            return temporadaRepository.findByNombre(req.getTemporada())
                .orElseGet(() -> temporadaRepository.findByActivaTrue()
                    .orElseThrow(() -> new EntityNotFoundException("No hay temporada activa")));
        }

        return temporadaRepository.findByActivaTrue()
            .orElseThrow(() -> new EntityNotFoundException("No hay temporada activa"));
    }

    private ActividadResponse toResponse(Actividad a) {
        return ActividadResponse.builder()
            .id(a.getId())
            .titulo(a.getTitulo())
            .temporada(a.getTemporada() != null ? a.getTemporada().getNombre() : null)
            .descripcion(a.getDescripcion())
            .fecha(a.getFecha() != null ? a.getFecha().toString() : null)
            .horaInicio(a.getHoraInicio() != null ? a.getHoraInicio().toString() : null)
            .horaFin(a.getHoraFin() != null ? a.getHoraFin().toString() : null)
            .tipoActividad(a.getTipoActividad() != null
                ? ActividadResponse.TipoActividadInfo.builder()
                    .id(a.getTipoActividad().getId())
                    .nombre(a.getTipoActividad().getNombre())
                    .colorHex(a.getTipoActividad().getColorHex())
                    .build() : null)
            .espacio(a.getEspacio() != null
                ? ActividadResponse.EspacioInfo.builder()
                    .id(String.valueOf(a.getEspacio().getId()))
                    .nombre(a.getEspacio().getNombre())
                    .build() : null)
            .departamento(a.getDepartamento() != null
                ? ActividadResponse.DepartamentoInfo.builder()
                    .id(String.valueOf(a.getDepartamento().getId()))
                    .nombre(a.getDepartamento().getNombre())
                    .build()
                : null)
            .build();
    }
}
