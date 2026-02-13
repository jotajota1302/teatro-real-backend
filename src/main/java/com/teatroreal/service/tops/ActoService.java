package com.teatroreal.service.tops;

import com.teatroreal.domain.tops.Acto;
import com.teatroreal.domain.tops.Guion;
import com.teatroreal.domain.tops.PasadaItem;
import com.teatroreal.dto.response.ActoResponse;
import com.teatroreal.repository.tops.ActoRepository;
import com.teatroreal.repository.tops.GuionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ActoService {

    private final ActoRepository actoRepository;
    private final GuionRepository guionRepository;

    /**
     * Crea un nuevo acto en un guion
     */
    public ActoResponse crearActoEnGuion(String guionId, String nombre, Integer orden) {
        Guion guion = guionRepository.findById(guionId)
                .orElseThrow(() -> new EntityNotFoundException("Guion no encontrado: " + guionId));

        // Si no se especifica orden, calcular el siguiente
        if (orden == null) {
            orden = actoRepository.countByGuionId(guionId) + 1;
        }

        Acto acto = new Acto();
        acto.setGuion(guion);
        acto.setNombre(nombre);
        acto.setOrden(orden);

        // Crear fila inicial vacía en la sub-sección Pasada del nuevo acto.
        PasadaItem pasadaInicial = new PasadaItem();
        pasadaInicial.setOrden(1);
        pasadaInicial.setDepartamento("");
        pasadaInicial.setLugar("");
        pasadaInicial.setDescripcion("");
        acto.addPasadaItem(pasadaInicial);

        Acto saved = actoRepository.save(acto);
        return ActoResponse.fromEntity(saved);
    }

    /**
     * Actualiza un acto existente
     */
    public ActoResponse actualizarActo(String actoId, String nombre, Integer orden) {
        Acto acto = actoRepository.findById(actoId)
                .orElseThrow(() -> new EntityNotFoundException("Acto no encontrado: " + actoId));

        if (nombre != null) {
            acto.setNombre(nombre);
        }
        if (orden != null) {
            acto.setOrden(orden);
        }

        Acto saved = actoRepository.save(acto);
        return ActoResponse.fromEntity(saved);
    }

    /**
     * Elimina un acto
     */
    public void eliminarActo(String actoId) {
        if (!actoRepository.existsById(actoId)) {
            throw new EntityNotFoundException("Acto no encontrado: " + actoId);
        }
        actoRepository.deleteById(actoId);
    }

    /**
     * Obtiene un acto por ID
     */
    public ActoResponse obtenerActo(String actoId) {
        Acto acto = actoRepository.findById(actoId)
                .orElseThrow(() -> new EntityNotFoundException("Acto no encontrado: " + actoId));
        return ActoResponse.fromEntity(acto);
    }
}
