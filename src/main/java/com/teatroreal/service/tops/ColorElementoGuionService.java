package com.teatroreal.service.tops;

import com.teatroreal.domain.tops.ColorElementoGuion;
import com.teatroreal.domain.tops.ElementoGuion;
import com.teatroreal.repository.tops.ColorElementoGuionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ColorElementoGuionService {

    private final ColorElementoGuionRepository repository;

    public List<ColorElementoGuion> getAll() {
        return repository.findAll();
    }

    public ColorElementoGuion getByTipoElemento(ElementoGuion.TipoElemento tipoElemento) {
        return repository.findByTipoElemento(tipoElemento);
    }

    public ColorElementoGuion createOrUpdate(ElementoGuion.TipoElemento tipoElemento, String colorHex, String descripcion) {
        ColorElementoGuion color = repository.findByTipoElemento(tipoElemento);
        if (color == null) {
            color = new ColorElementoGuion();
            color.setTipoElemento(tipoElemento);
        }
        color.setColorHex(colorHex);
        color.setDescripcion(descripcion);
        return repository.save(color);
    }
}
