package com.teatroreal.service;

import com.teatroreal.dto.EspacioDTO;
import com.teatroreal.entity.Espacio;
import com.teatroreal.repository.EspacioRepository;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EspacioService {

    private final EspacioRepository espacioRepository;

    @Transactional(readOnly = true)
    public List<EspacioDTO> findAll() {
        return espacioRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EspacioDTO> findAllActivos() {
        return espacioRepository.findByActivoTrue().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EspacioDTO findById(Long id) {
        return espacioRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new EntityNotFoundException("Espacio no encontrado con id: " + id));
    }

    @Transactional
    public EspacioDTO create(EspacioDTO dto) {
        Espacio espacio = toEntity(dto);
        espacio.setActivo(true);
        Espacio saved = espacioRepository.save(espacio);
        return toDTO(saved);
    }

    @Transactional
    public EspacioDTO update(Long id, EspacioDTO dto) {
        Espacio espacio = espacioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Espacio no encontrado con id: " + id));

        espacio.setNombre(dto.getNombre());
        espacio.setTipo(dto.getTipo());
        espacio.setDescripcion(dto.getDescripcion());
        espacio.setCapacidad(dto.getCapacidad());

        if (dto.getActivo() != null) {
            espacio.setActivo(dto.getActivo());
        }

        Espacio saved = espacioRepository.save(espacio);
        return toDTO(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!espacioRepository.existsById(id)) {
            throw new EntityNotFoundException("Espacio no encontrado con id: " + id);
        }
        espacioRepository.deleteById(id);
    }

    private EspacioDTO toDTO(Espacio entity) {
        return EspacioDTO.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .tipo(entity.getTipo())
                .descripcion(entity.getDescripcion())
                .capacidad(entity.getCapacidad())
                .activo(entity.getActivo())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private Espacio toEntity(EspacioDTO dto) {
        return Espacio.builder()
                .nombre(dto.getNombre())
                .tipo(dto.getTipo())
                .descripcion(dto.getDescripcion())
                .capacidad(dto.getCapacidad())
                .activo(dto.getActivo() != null ? dto.getActivo() : true)
                .build();
    }
}
