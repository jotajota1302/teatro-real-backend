package com.teatroreal.service.tops;

import com.teatroreal.domain.tops.Acto;
import com.teatroreal.domain.tops.Guion;
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

    public Acto crearActoEnGuion(String guionId, String nombre, Integer orden) {
        Guion guion = guionRepository.findById(guionId)
                .orElseThrow(() -> new EntityNotFoundException("Guion no encontrado"));
        Acto acto = new Acto();
        acto.setGuion(guion);
        acto.setNombre(nombre);
        acto.setOrden(orden != null ? orden : 0);
        return actoRepository.save(acto);
    }

    // Otros métodos si fueran necesarios...
}
