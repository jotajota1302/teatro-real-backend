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

    public ElementoGuion crearElementoEnEscena(String escenaId, String descripcion, String tipoElemento, Integer orden, String colorHex) {
        Escena escena = escenaRepository.findById(escenaId)
                .orElseThrow(() -> new EntityNotFoundException("Escena no encontrada"));
        ElementoGuion elemento = new ElementoGuion();
        elemento.setEscena(escena);
        elemento.setDescripcion(descripcion);
        elemento.setTipoElemento(ElementoGuion.TipoElemento.valueOf(tipoElemento));
        elemento.setOrden(orden != null ? orden : 0);
        elemento.setColorHex(colorHex);
        return elementoGuionRepository.save(elemento);
    }

    public void eliminarElemento(String escenaId, String elementoId) {
        ElementoGuion elemento = elementoGuionRepository.findById(elementoId)
                .orElseThrow(() -> new EntityNotFoundException("Elemento no encontrado"));

        // Verify the element belongs to the specified scene
        if (!elemento.getEscena().getId().equals(escenaId)) {
            throw new IllegalArgumentException("El elemento no pertenece a la escena especificada");
        }

        elementoGuionRepository.deleteById(elementoId);
    }

    public ElementoGuion actualizarElemento(String escenaId, String elementoId, String descripcion, String tipoElemento, Integer orden, String colorHex) {
        ElementoGuion elemento = elementoGuionRepository.findById(elementoId)
                .orElseThrow(() -> new EntityNotFoundException("Elemento no encontrado"));

        // Verify the element belongs to the specified scene
        if (!elemento.getEscena().getId().equals(escenaId)) {
            throw new IllegalArgumentException("El elemento no pertenece a la escena especificada");
        }

        if (descripcion != null) elemento.setDescripcion(descripcion);
        if (tipoElemento != null) elemento.setTipoElemento(ElementoGuion.TipoElemento.valueOf(tipoElemento));
        if (orden != null) elemento.setOrden(orden);
        if (colorHex != null) elemento.setColorHex(colorHex);

        return elementoGuionRepository.save(elemento);
    }
}
