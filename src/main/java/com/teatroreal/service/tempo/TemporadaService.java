package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.Temporada;
import com.teatroreal.exception.ValidationException;
import com.teatroreal.repository.tempo.TemporadaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class TemporadaService {
    private final TemporadaRepository temporadaRepository;

    public TemporadaService(TemporadaRepository temporadaRepository) {
        this.temporadaRepository = temporadaRepository;
    }

    @Transactional(readOnly = true)
    public List<Temporada> findAll() {
        return temporadaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Temporada findById(Long id) {
        return findEntityById(id);
    }

    public Temporada create(Temporada temporada) {
        validateTemporada(temporada);

        if (temporadaRepository.existsByNombreIgnoreCase(temporada.getNombre())) {
            throw new ValidationException("Ya existe una temporada con ese nombre");
        }

        temporada.setId(null);
        temporada.setCreatedAt(null);
        temporada.setActiva(Boolean.TRUE.equals(temporada.getActiva()));

        if (Boolean.TRUE.equals(temporada.getActiva())) {
            desactivarTodas();
        }

        return temporadaRepository.save(temporada);
    }

    public Temporada update(Long id, Temporada temporada) {
        validateTemporada(temporada);

        Temporada existing = findEntityById(id);
        boolean cambiaNombre = !existing.getNombre().equalsIgnoreCase(temporada.getNombre());
        if (cambiaNombre && temporadaRepository.existsByNombreIgnoreCase(temporada.getNombre())) {
            throw new ValidationException("Ya existe una temporada con ese nombre");
        }

        existing.setNombre(temporada.getNombre());
        existing.setFechaInicio(temporada.getFechaInicio());
        existing.setFechaFin(temporada.getFechaFin());

        Boolean activaSolicitada = temporada.getActiva();
        if (activaSolicitada != null) {
            if (Boolean.TRUE.equals(activaSolicitada)) {
                desactivarTodas();
                existing.setActiva(true);
            } else {
                existing.setActiva(false);
            }
        }

        return temporadaRepository.save(existing);
    }

    public void delete(Long id) {
        temporadaRepository.delete(findEntityById(id));
    }

    // Activar temporada (marca solo una como activa)
    public Temporada activar(Long id) {
        Temporada target = findEntityById(id);
        desactivarTodas();
        target.setActiva(true);
        return temporadaRepository.save(target);
    }

    private Temporada findEntityById(Long id) {
        return temporadaRepository.findById(id)
            .orElseThrow(() -> new ValidationException("Temporada no encontrada"));
    }

    private void desactivarTodas() {
        temporadaRepository.findAll().forEach(t -> {
            if (Boolean.TRUE.equals(t.getActiva())) {
                t.setActiva(false);
                temporadaRepository.save(t);
            }
        });
    }

    private void validateTemporada(Temporada temporada) {
        String nombre = temporada.getNombre() != null ? temporada.getNombre().trim() : null;
        if (nombre == null || nombre.isBlank()) {
            throw new ValidationException("El nombre de la temporada es obligatorio");
        }

        temporada.setNombre(nombre);

        LocalDate fechaInicio = temporada.getFechaInicio();
        LocalDate fechaFin = temporada.getFechaFin();
        if (fechaInicio == null || fechaFin == null) {
            throw new ValidationException("Las fechas de inicio y fin son obligatorias");
        }
        if (fechaInicio.isAfter(fechaFin)) {
            throw new ValidationException("La fecha de inicio no puede ser posterior a la fecha de fin");
        }
    }
}
