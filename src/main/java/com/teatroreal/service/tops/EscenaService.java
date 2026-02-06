package com.teatroreal.service.tops;

import com.teatroreal.domain.tops.Acto;
import com.teatroreal.domain.tops.Escena;
import com.teatroreal.repository.tops.ActoRepository;
import com.teatroreal.repository.tops.EscenaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EscenaService {

    private final EscenaRepository escenaRepository;
    private final ActoRepository actoRepository;

    public Escena crearEscenaEnActo(String actoId, String nombre, Integer orden) {
        Acto acto = actoRepository.findById(actoId)
                .orElseThrow(() -> new EntityNotFoundException("Acto no encontrado"));
        Escena escena = new Escena();
        escena.setActo(acto);
        escena.setNombre(nombre);
        escena.setOrden(orden != null ? orden : 0);
        return escenaRepository.save(escena);
    }

    public Escena updateEscena(String escenaId, String nombre, String duracion) {
        Escena escena = escenaRepository.findById(escenaId)
                .orElseThrow(() -> new EntityNotFoundException("Escena no encontrada"));
        if (nombre != null) {
            escena.setNombre(nombre);
        }
        if (duracion != null) {
            escena.setDuracion(duracion);
        }
        return escenaRepository.save(escena);
    }

    public void deleteEscena(String escenaId) {
        Escena escena = escenaRepository.findById(escenaId)
                .orElseThrow(() -> new EntityNotFoundException("Escena no encontrada"));
        escenaRepository.delete(escena);
    }
}
