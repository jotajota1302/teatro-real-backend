package com.teatroreal.service.tops;

import com.teatroreal.domain.tops.Escena;
import com.teatroreal.domain.tops.ElementoGuion;
import com.teatroreal.repository.tops.EscenaRepository;
import com.teatroreal.repository.tops.ElementoGuionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ElementoGuionService {

    private final ElementoGuionRepository elementoGuionRepository;
    private final EscenaRepository escenaRepository;

    public ElementoGuion crearElementoEnEscena(String escenaId, String texto, String tipoElemento, Integer orden, String colorHex) {
        Escena escena = escenaRepository.findById(escenaId)
                .orElseThrow(() -> new EntityNotFoundException("Escena no encontrada"));
        ElementoGuion elemento = new ElementoGuion();
        elemento.setEscena(escena);
        elemento.setTexto(texto);
        elemento.setTipoElemento(ElementoGuion.TipoElemento.valueOf(tipoElemento));
        elemento.setOrden(orden != null ? orden : 0);
        elemento.setColorHex(colorHex);
        return elementoGuionRepository.save(elemento);
    }

    // Otros métodos CRUD o de batch update si se requieren...
}
