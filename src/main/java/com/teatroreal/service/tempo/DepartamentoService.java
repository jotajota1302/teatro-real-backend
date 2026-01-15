package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.Departamento;
import com.teatroreal.domain.user.Usuario;
import com.teatroreal.repository.DepartamentoRepository;
import com.teatroreal.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.NoSuchElementException;

@Service
public class DepartamentoService {
    private final DepartamentoRepository departamentoRepository;
    private final UsuarioRepository usuarioRepository;

    public DepartamentoService(DepartamentoRepository departamentoRepository, UsuarioRepository usuarioRepository) {
        this.departamentoRepository = departamentoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Departamento> findAll() {
        return departamentoRepository.findAll();
    }

    public Departamento findById(Long id) {
        return departamentoRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Departamento no encontrado"));
    }

    public Departamento create(Departamento d) {
        // handle jefe and personal saving if needed
        return departamentoRepository.save(d);
    }

    public Departamento update(Long id, Departamento d) {
        Departamento existing = departamentoRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Departamento no encontrado"));
        existing.setNombre(d.getNombre());
        existing.setCodigo(d.getCodigo());
        existing.setDescripcion(d.getDescripcion());
        existing.setAmbito(d.getAmbito());
        existing.setColorHex(d.getColorHex());
        existing.setJefe(d.getJefe());
        existing.setPersonal(d.getPersonal()); // update list of users
        return departamentoRepository.save(existing);
    }

    public void delete(Long id) {
        departamentoRepository.deleteById(id);
    }

    // Asigna jefe y personal a un departamento
    public Departamento setJefeYPersonal(Long departamentoId, String jefeId, Set<String> personalIds) {
        Departamento d = departamentoRepository.findById(departamentoId).orElseThrow(() -> new NoSuchElementException("Departamento no encontrado"));
        if (jefeId != null) {
            Usuario jefe = usuarioRepository.findById(jefeId).orElse(null);
            d.setJefe(jefe);
        }
        if (personalIds != null) {
            Set<Usuario> personal = usuarioRepository.findAllById(personalIds).stream().collect(java.util.stream.Collectors.toSet());
            d.setPersonal(personal);
        }
        return departamentoRepository.save(d);
    }
}
