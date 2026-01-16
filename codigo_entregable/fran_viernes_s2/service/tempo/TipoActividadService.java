package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.TipoActividad;
import com.teatroreal.dto.request.TipoActividadRequest;
import com.teatroreal.dto.response.TipoActividadResponse;
import com.teatroreal.repository.tempo.TipoActividadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TipoActividadService {

    private final TipoActividadRepository tipoActividadRepository;

    public List<TipoActividadResponse> listar() {
        return tipoActividadRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TipoActividadResponse detalle(Long id) {
        TipoActividad t = tipoActividadRepository.findById(id).orElseThrow(() -> new RuntimeException("TipoActividad no encontrado"));
        return toResponse(t);
    }

    public TipoActividadResponse crear(TipoActividadRequest req) {
        TipoActividad t = toEntity(req, null);
        tipoActividadRepository.save(t);
        return toResponse(t);
    }

    public TipoActividadResponse actualizar(Long id, TipoActividadRequest req) {
        TipoActividad t = tipoActividadRepository.findById(id).orElseThrow(() -> new RuntimeException("TipoActividad no encontrado"));
        toEntity(req, t);
        tipoActividadRepository.save(t);
        return toResponse(t);
    }

    public void eliminar(Long id) {
        tipoActividadRepository.deleteById(id);
    }

    private TipoActividad toEntity(TipoActividadRequest req, TipoActividad tOld) {
        TipoActividad t = (tOld != null) ? tOld : new TipoActividad();
        t.setNombre(req.getNombre());
        t.setColor(req.getColor());
        t.setActivo(req.getActivo() != null ? req.getActivo() : true);
        t.setDescripcion(req.getDescripcion());
        return t;
    }

    private TipoActividadResponse toResponse(TipoActividad t) {
        TipoActividadResponse r = new TipoActividadResponse();
        r.setId(t.getId());
        r.setNombre(t.getNombre());
        r.setColor(t.getColor());
        r.setActivo(t.getActivo());
        r.setDescripcion(t.getDescripcion());
        return r;
    }
}
