package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.Actividad;
import com.teatroreal.domain.tempo.EstadoActividad;
import com.teatroreal.repository.tempo.ActividadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

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

    // NUEVO: Filtro combinado (espacio, tipo, temporada, fecha)
    public List<Actividad> findByCriteria(Long espacioId, Long tipoActividadId, String temporada, LocalDate fecha) {
        return repository.findAll().stream()
                .filter(a -> espacioId == null || a.getEspacio().getId().equals(espacioId))
                .filter(a -> tipoActividadId == null || a.getTipoActividad().getId().equals(tipoActividadId))
                .filter(a -> temporada == null || a.getTemporada().equalsIgnoreCase(temporada))
                .filter(a -> fecha == null || a.getFecha().equals(fecha))
                .collect(Collectors.toList());
    }

    // NUEVO: Clonar actividad a nueva fecha
    public Actividad clonarActividad(String id, LocalDate nuevaFecha) {
        Actividad original = findById(id);
        Actividad clon = new Actividad();
        clon.setTitulo(original.getTitulo());
        clon.setTemporada(original.getTemporada());
        clon.setDescripcion(original.getDescripcion());
        clon.setTipoActividad(original.getTipoActividad());
        clon.setEspacio(original.getEspacio());
        clon.setHoraInicio(original.getHoraInicio());
        clon.setHoraFin(original.getHoraFin());
        clon.setNotas(original.getNotas());
        clon.setEstado(original.getEstado());
        clon.setFecha(nuevaFecha);
        return repository.save(clon);
    }

    // NUEVO: Cambiar estado actividad almacén
    public Actividad actualizarEstado(String id, EstadoActividad nuevoEstado) {
        Actividad actividad = findById(id);
        actividad.setEstado(nuevoEstado);
        return repository.save(actividad);
    }
}
