package com.teatroreal.service;

import com.teatroreal.domain.tempo.Temporada;
import com.teatroreal.repository.TemporadaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TemporadaService {
    private final TemporadaRepository temporadaRepository;

    public TemporadaService(TemporadaRepository temporadaRepository) {
        this.temporadaRepository = temporadaRepository;
    }

    public List<Temporada> findAll() {
        return temporadaRepository.findAll();
    }

    public Temporada findById(Long id) {
        return temporadaRepository.findById(id).orElseThrow();
    }

    public Temporada create(Temporada t) {
        return temporadaRepository.save(t);
    }

    public Temporada update(Long id, Temporada t) {
        Temporada existing = temporadaRepository.findById(id).orElseThrow();
        existing.setNombre(t.getNombre());
        existing.setFechaInicio(t.getFechaInicio());
        existing.setFechaFin(t.getFechaFin());
        existing.setActiva(t.getActiva());
        return temporadaRepository.save(existing);
    }

    public void delete(Long id) {
        temporadaRepository.deleteById(id);
    }

    // Activar temporada (marca solo una como activa)
    public Temporada activar(Long id) {
        List<Temporada> temporadas = temporadaRepository.findAll();
        for (Temporada t : temporadas) {
            t.setActiva(t.getId().equals(id));
            temporadaRepository.save(t);
        }
        return temporadaRepository.findById(id).orElseThrow();
    }
}
