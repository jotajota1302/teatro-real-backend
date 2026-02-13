package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.Departamento;
import com.teatroreal.dto.request.DepartamentoRequest;
import com.teatroreal.dto.response.DepartamentoResponse;
import com.teatroreal.mapper.DepartamentoMapper;
import com.teatroreal.repository.tempo.DepartamentoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@Transactional
public class DepartamentoService {
    private final DepartamentoRepository departamentoRepository;
    private final DepartamentoMapper departamentoMapper;

    public DepartamentoService(DepartamentoRepository departamentoRepository, DepartamentoMapper departamentoMapper) {
        this.departamentoRepository = departamentoRepository;
        this.departamentoMapper = departamentoMapper;
    }

    @Transactional(readOnly = true)
    public List<DepartamentoResponse> findAll() {
        return departamentoMapper.toResponseList(departamentoRepository.findAll());
    }

    @Transactional(readOnly = true)
    public DepartamentoResponse findById(Long id) {
        return departamentoMapper.toResponse(findEntityById(id));
    }

    public DepartamentoResponse create(DepartamentoRequest request) {
        Departamento departamento = departamentoMapper.toEntity(request);
        return departamentoMapper.toResponse(departamentoRepository.save(departamento));
    }

    public DepartamentoResponse update(Long id, DepartamentoRequest request) {
        Departamento existing = findEntityById(id);
        departamentoMapper.updateEntity(existing, request);
        return departamentoMapper.toResponse(departamentoRepository.save(existing));
    }

    public void delete(Long id) {
        departamentoRepository.delete(findEntityById(id));
    }

    // Asigna jefe y personal a un departamento
    public DepartamentoResponse setJefeYPersonal(Long departamentoId, String jefeId, Set<String> personalIds) {
        Departamento existing = findEntityById(departamentoId);
        DepartamentoRequest request = new DepartamentoRequest();
        request.setCodigo(existing.getCodigo());
        request.setNombre(existing.getNombre());
        request.setDescripcion(existing.getDescripcion());
        request.setAmbito(existing.getAmbito());
        request.setColorHex(existing.getColorHex());
        request.setJefeId(jefeId);
        request.setPersonalIds(personalIds);
        departamentoMapper.updateEntity(existing, request);
        return departamentoMapper.toResponse(departamentoRepository.save(existing));
    }

    private Departamento findEntityById(Long id) {
        return departamentoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Departamento no encontrado"));
    }
}
