package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.TipoActividad;
import com.teatroreal.dto.request.TipoActividadRequest;
import com.teatroreal.dto.response.TipoActividadResponse;
import com.teatroreal.repository.tempo.TipoActividadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TipoActividadService {

    private final TipoActividadRepository tipoActividadRepository;

    public List<TipoActividadResponse> getAll() {
        return tipoActividadRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TipoActividadResponse getById(String id) {
        return tipoActividadRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("TipoActividad no encontrado"));
    }

    public TipoActividadResponse create(TipoActividadRequest request) {
        if (tipoActividadRepository.existsByNombreIgnoreCase(request.getNombre())) {
            throw new IllegalArgumentException("Ya existe un Tipo de Actividad con ese nombre");
        }
        TipoActividad tipoActividad = new TipoActividad();
        tipoActividad.setNombre(request.getNombre());
        tipoActividad.setColorHex(request.getColorHex());
        tipoActividad.setDescripcion(request.getDescripcion());
        if (request.getActivo() != null) {
            tipoActividad.setActivo(request.getActivo());
        } else {
            tipoActividad.setActivo(true);
        }
        tipoActividad = tipoActividadRepository.save(tipoActividad);
        return toResponse(tipoActividad);
    }

    public TipoActividadResponse update(String id, TipoActividadRequest request) {
        TipoActividad tipoActividad = tipoActividadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("TipoActividad no encontrado"));

        boolean nombreChanged = !tipoActividad.getNombre().equalsIgnoreCase(request.getNombre());
        if (nombreChanged && tipoActividadRepository.existsByNombreIgnoreCase(request.getNombre())) {
            throw new IllegalArgumentException("Ya existe un Tipo de Actividad con ese nombre");
        }

        tipoActividad.setNombre(request.getNombre());
        tipoActividad.setColorHex(request.getColorHex());
        tipoActividad.setDescripcion(request.getDescripcion());
        if (request.getActivo() != null) {
            tipoActividad.setActivo(request.getActivo());
        }
        tipoActividad = tipoActividadRepository.save(tipoActividad);
        return toResponse(tipoActividad);
    }

    public void delete(String id) {
        TipoActividad tipoActividad = tipoActividadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("TipoActividad no encontrado"));
        tipoActividadRepository.delete(tipoActividad);
    }

    private TipoActividadResponse toResponse(TipoActividad tipo) {
        return TipoActividadResponse.builder()
                .id(tipo.getId())
                .nombre(tipo.getNombre())
                .colorHex(tipo.getColorHex())
                .descripcion(tipo.getDescripcion())
                .activo(tipo.getActivo())
                .build();
    }
}
