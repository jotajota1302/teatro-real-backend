package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.Actividad;
import com.teatroreal.repository.tempo.ActividadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActividadService {

    private final ActividadRepository repository;

    public List<Actividad> findAll() {
        return repository.findAll();
    }

    public Actividad findById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Actividad no encontrada"));
    }

    public Actividad save(@Valid Actividad actividad) {
        return repository.save(actividad);
    }

    public void delete(String id) {
        Actividad a = findById(id);
        repository.delete(a);
    }

    public List<Actividad> findByTemporada(String temporada) {
        return repository.findByTemporada(temporada);
    }

    public List<Actividad> findByEspacioId(Long espacioId) {
        return repository.findByEspacioId(espacioId);
    }

    public List<Actividad> findByTipoActividadId(Long tipoActividadId) {
        return repository.findByTipoActividadId(tipoActividadId);
    }
}
