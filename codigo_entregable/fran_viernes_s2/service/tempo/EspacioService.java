package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.Espacio;
import com.teatroreal.dto.request.EspacioRequest;
import com.teatroreal.dto.response.EspacioResponse;
import com.teatroreal.repository.tempo.EspacioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EspacioService {

    private final EspacioRepository espacioRepository;

    public List<EspacioResponse> listar() {
        return espacioRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public EspacioResponse detalle(Long id) {
        Espacio e = espacioRepository.findById(id).orElseThrow(() -> new RuntimeException("Espacio no encontrado"));
        return toResponse(e);
    }

    public EspacioResponse crear(EspacioRequest req) {
        Espacio e = toEntity(req, null);
        espacioRepository.save(e);
        return toResponse(e);
    }

    public EspacioResponse actualizar(Long id, EspacioRequest req) {
        Espacio e = espacioRepository.findById(id).orElseThrow(() -> new RuntimeException("Espacio no encontrado"));
        toEntity(req, e);
        espacioRepository.save(e);
        return toResponse(e);
    }

    public void eliminar(Long id) {
        espacioRepository.deleteById(id);
    }

    private Espacio toEntity(EspacioRequest req, Espacio eOld) {
        Espacio e = (eOld != null) ? eOld : new Espacio();
        e.setNombre(req.getNombre());
        e.setTipo(com.teatroreal.domain.tempo.TipoEspacio.valueOf(req.getTipo()));
        e.setColor(req.getColor());
        e.setCapacidad(req.getCapacidad());
        e.setDimensiones(req.getDimensiones());
        e.setUbicacion(req.getUbicacion());
        e.setActivo(req.getActivo() != null ? req.getActivo() : true);
        e.setOrden(req.getOrden());
        return e;
    }

    private EspacioResponse toResponse(Espacio e) {
        EspacioResponse r = new EspacioResponse();
        r.setId(e.getId());
        r.setNombre(e.getNombre());
        r.setTipo(e.getTipo().name());
        r.setColor(e.getColor());
        r.setCapacidad(e.getCapacidad());
        r.setDimensiones(e.getDimensiones());
        r.setUbicacion(e.getUbicacion());
        r.setActivo(e.getActivo());
        r.setOrden(e.getOrden());
        return r;
    }
}
