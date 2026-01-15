package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.TipoActividad;
import com.teatroreal.repository.tempo.TipoActividadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TipoActividadService {

    private final TipoActividadRepository repository;

    public List<TipoActividad> findAll() {
        return repository.findAll();
    }

    public TipoActividad findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("TipoActividad no encontrado"));
    }

    public TipoActividad save(@Valid TipoActividad tipoActividad) {
        // Validación: nombre único
        repository.findByNombre(tipoActividad.getNombre()).ifPresent(existing -> {
            if (tipoActividad.getId() == null || !existing.getId().equals(tipoActividad.getId())) {
                throw new IllegalArgumentException("Ya existe un tipo de actividad con ese nombre");
            }
        });
        return repository.save(tipoActividad);
    }

    public void delete(Long id) {
        TipoActividad ta = findById(id);
        repository.delete(ta);
    }
}
