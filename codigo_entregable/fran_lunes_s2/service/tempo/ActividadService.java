package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.*;
import com.teatroreal.dto.request.ActividadRequest;
import com.teatroreal.dto.response.ActividadResponse;
import com.teatroreal.dto.response.ActividadResponse.*;
import com.teatroreal.repository.tempo.ActividadRepository;
import com.teatroreal.repository.tempo.TipoActividadRepository;
import com.teatroreal.repository.tempo.EspacioRepository;
import com.teatroreal.repository.tempo.TemporadaRepository;
import com.teatroreal.repository.tempo.DepartamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ActividadService {

    private final ActividadRepository actividadRepository;
    private final TipoActividadRepository tipoActividadRepository;
    private final EspacioRepository espacioRepository;
    private final TemporadaRepository temporadaRepository;
    private final DepartamentoRepository departamentoRepository;

    public List<ActividadResponse> getAll() {
        return actividadRepository.findAll()
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public ActividadResponse getById(String id) {
        return actividadRepository.findById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new EntityNotFoundException("Actividad no encontrada"));
    }

    public ActividadResponse create(ActividadRequest req) {
        // Validar entidades relacionadas
        Temporada temporada = temporadaRepository.findById(req.getTemporadaId())
            .orElseThrow(() -> new EntityNotFoundException("Temporada no encontrada"));
        TipoActividad tipo = tipoActividadRepository.findById(req.getTipoActividadId())
            .orElseThrow(() -> new EntityNotFoundException("TipoActividad no encontrado"));
        Espacio espacio = espacioRepository.findById(req.getEspacioId())
            .orElseThrow(() -> new EntityNotFoundException("Espacio no encontrado"));
        Departamento departamento = null;
        if (req.getDepartamentoId() != null && !req.getDepartamentoId().isEmpty()) {
            departamento = departamentoRepository.findById(req.getDepartamentoId())
                .orElseThrow(() -> new EntityNotFoundException("Departamento no encontrado"));
        }

        Actividad actividad = Actividad.builder()
            .temporada(temporada)
            .tipoActividad(tipo)
            .descripcion(req.getDescripcion())
            .estado(Actividad.EstadoActividad.valueOf(req.getEstado()))
            .fecha(LocalDate.parse(req.getFecha()))
            .horaInicio(LocalTime.parse(req.getHoraInicio()))
            .horaFin(LocalTime.parse(req.getHoraFin()))
            .espacio(espacio)
            .departamento(departamento)
            .notas(req.getNotas())
            .build();

        actividad = actividadRepository.save(actividad);
        return toResponse(actividad);
    }

    public ActividadResponse update(String id, ActividadRequest req) {
        Actividad actividad = actividadRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Actividad no encontrada"));

        Temporada temporada = temporadaRepository.findById(req.getTemporadaId())
            .orElseThrow(() -> new EntityNotFoundException("Temporada no encontrada"));
        TipoActividad tipo = tipoActividadRepository.findById(req.getTipoActividadId())
            .orElseThrow(() -> new EntityNotFoundException("TipoActividad no encontrado"));
        Espacio espacio = espacioRepository.findById(req.getEspacioId())
            .orElseThrow(() -> new EntityNotFoundException("Espacio no encontrado"));
        Departamento departamento = null;
        if (req.getDepartamentoId() != null && !req.getDepartamentoId().isEmpty()) {
            departamento = departamentoRepository.findById(req.getDepartamentoId())
                .orElseThrow(() -> new EntityNotFoundException("Departamento no encontrado"));
        }

        actividad.setTemporada(temporada);
        actividad.setTipoActividad(tipo);
        actividad.setDescripcion(req.getDescripcion());
        actividad.setEstado(Actividad.EstadoActividad.valueOf(req.getEstado()));
        actividad.setFecha(LocalDate.parse(req.getFecha()));
        actividad.setHoraInicio(LocalTime.parse(req.getHoraInicio()));
        actividad.setHoraFin(LocalTime.parse(req.getHoraFin()));
        actividad.setEspacio(espacio);
        actividad.setDepartamento(departamento);
        actividad.setNotas(req.getNotas());

        actividad = actividadRepository.save(actividad);
        return toResponse(actividad);
    }

    public void delete(String id) {
        Actividad actividad = actividadRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Actividad no encontrada"));
        actividadRepository.delete(actividad);
    }

    private ActividadResponse toResponse(Actividad a) {
        return ActividadResponse.builder()
            .id(a.getId())
            .descripcion(a.getDescripcion())
            .estado(a.getEstado().name())
            .fecha(a.getFecha().toString())
            .horaInicio(a.getHoraInicio().toString())
            .horaFin(a.getHoraFin().toString())
            .notas(a.getNotas())
            .tipoActividad(
                ActividadResponse.TipoActividadInfo.builder()
                    .id(a.getTipoActividad().getId())
                    .nombre(a.getTipoActividad().getNombre())
                    .colorHex(a.getTipoActividad().getColorHex())
                    .build())
            .espacio(
                ActividadResponse.EspacioInfo.builder()
                    .id(a.getEspacio().getId())
                    .nombre(a.getEspacio().getNombre())
                    .build())
            .temporada(
                ActividadResponse.TemporadaInfo.builder()
                    .id(a.getTemporada().getId())
                    .nombre(a.getTemporada().getNombre())
                    .build())
            .departamento(a.getDepartamento() != null
                ? ActividadResponse.DepartamentoInfo.builder()
                    .id(a.getDepartamento().getId())
                    .nombre(a.getDepartamento().getNombre())
                    .build()
                : null)
            .createdAt(a.getCreatedAt() != null ? a.getCreatedAt().toString() : null)
            .updatedAt(a.getUpdatedAt() != null ? a.getUpdatedAt().toString() : null)
            .build();
    }
}
