package com.teatroreal.service;

import com.teatroreal.domain.tempo.Departamento;
import com.teatroreal.repository.tempo.DepartamentoRepository;

import java.util.List;
import java.util.Optional;

public class DepartamentoService {
    private final DepartamentoRepository departamentoRepository;
    public DepartamentoService(DepartamentoRepository departamentoRepository) { this.departamentoRepository = departamentoRepository; }
    public List<Departamento> findAll() { return departamentoRepository.findAll(); }

    public Departamento create(Departamento d) {
        return departamentoRepository.save(d);
    }

    public Departamento update(Long id, Departamento d) {
        Optional<Departamento> optionalDepartamento = departamentoRepository.findById(id);
        if (optionalDepartamento.isPresent()) {
            Departamento existente = optionalDepartamento.get();
            // Actualizar aquí los campos relevantes del departamento
            existente.setNombre(d.getNombre());
            // Si hay más campos en Departamento, aquí puedes añadirlos:
            // existente.setOtroCampo(d.getOtroCampo());
            return departamentoRepository.save(existente);
        } else {
            return null; // O lanza una excepción si prefieres
        }
    }
}
