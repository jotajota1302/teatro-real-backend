package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.Espacio;
import com.teatroreal.dto.request.EspacioRequest;
import com.teatroreal.dto.response.EspacioResponse;
import com.teatroreal.repository.tempo.EspacioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service("espacioTempoService")
@RequiredArgsConstructor
@Transactional
public class EspacioService {

    private final EspacioRepository espacioRepository;

    public List<EspacioResponse> getAll() {
        return espacioRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public EspacioResponse getById(Long id) {
        return toResponse(findById(id));
    }

    public EspacioResponse create(EspacioRequest request) {
        Espacio espacio = new Espacio();
        applyFromRequest(espacio, request, true);
        return toResponse(espacioRepository.save(espacio));
    }

    public EspacioResponse update(Long id, EspacioRequest request) {
        Espacio espacio = findById(id);
        applyFromRequest(espacio, request, false);
        return toResponse(espacioRepository.save(espacio));
    }

    public void delete(Long id) {
        Espacio espacio = findById(id);
        espacioRepository.delete(espacio);
    }

    private Espacio findById(Long id) {
        return espacioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Espacio no encontrado"));
    }

    private void applyFromRequest(Espacio espacio, EspacioRequest request, boolean crear) {
        espacio.setNombre(request.getNombre());
        espacio.setTipo(request.getTipo());
        espacio.setGoogleCalendarId(request.getGoogleCalendarId());
        espacio.setColor(request.getColor());
        espacio.setCapacidad(request.getCapacidad());
        espacio.setDimensiones(request.getDimensiones());
        espacio.setUbicacion(request.getUbicacion());
        if (request.getActivo() != null) {
            espacio.setActivo(request.getActivo());
        } else if (crear && espacio.getActivo() == null) {
            espacio.setActivo(true);
        }
        if (request.getOrden() != null) {
            espacio.setOrden(request.getOrden());
        } else if (crear && espacio.getOrden() == null) {
            espacio.setOrden(0);
        }
    }

    private EspacioResponse toResponse(Espacio espacio) {
        return EspacioResponse.builder()
                .id(espacio.getId())
                .nombre(espacio.getNombre())
                .tipo(espacio.getTipo())
                .googleCalendarId(espacio.getGoogleCalendarId())
                .color(espacio.getColor())
                .capacidad(espacio.getCapacidad())
                .dimensiones(espacio.getDimensiones())
                .ubicacion(espacio.getUbicacion())
                .activo(espacio.getActivo() == null ? true : espacio.getActivo())
                .orden(espacio.getOrden())
                .build();
    }
}
