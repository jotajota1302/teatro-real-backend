package com.teatroreal.mapper;

import com.teatroreal.domain.tempo.Departamento;
import com.teatroreal.domain.user.Usuario;
import com.teatroreal.dto.request.DepartamentoRequest;
import com.teatroreal.dto.response.DepartamentoResponse;
import com.teatroreal.dto.response.RolResponse;
import com.teatroreal.dto.response.UsuarioResponse;
import com.teatroreal.repository.UsuarioRepository;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class DepartamentoMapper {
    
    private final UsuarioRepository usuarioRepository;
    
    public DepartamentoMapper(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    
    /**
     * Convierte una entidad Departamento a DepartamentoResponse (DTO)
     */
    public DepartamentoResponse toResponse(Departamento departamento) {
        if (departamento == null) {
            return null;
        }
        
        DepartamentoResponse response = new DepartamentoResponse();
        response.id = departamento.getId();
        response.codigo = departamento.getCodigo();
        response.nombre = departamento.getNombre();
        response.descripcion = departamento.getDescripcion();
        response.ambito = departamento.getAmbito();
        response.colorHex = departamento.getColorHex();
        
        // Mapear jefe (puede ser null)
        if (departamento.getJefe() != null) {
            response.jefe = mapUsuarioToResponse(departamento.getJefe());
        }
        
        // Mapear personal (inicializar la colección LAZY de forma segura)
        if (departamento.getPersonal() != null && !departamento.getPersonal().isEmpty()) {
            response.personal = departamento.getPersonal().stream()
                .map(this::mapUsuarioToResponse)
                .collect(Collectors.toList());
        } else {
            response.personal = Collections.emptyList();
        }
        
        return response;
    }
    
    /**
     * Convierte un DepartamentoRequest (DTO) a entidad Departamento
     */
    public Departamento toEntity(DepartamentoRequest request) {
        if (request == null) {
            return null;
        }
        
        Departamento departamento = new Departamento();
        departamento.setCodigo(request.getCodigo());
        departamento.setNombre(request.getNombre());
        departamento.setDescripcion(request.getDescripcion());
        departamento.setAmbito(request.getAmbito());
        departamento.setColorHex(request.getColorHex());
        
        // Cargar jefe si se proporciona
        if (request.getJefeId() != null && !request.getJefeId().isBlank()) {
            usuarioRepository.findById(request.getJefeId())
                .ifPresent(departamento::setJefe);
        }
        
        // Cargar personal si se proporciona
        if (request.getPersonalIds() != null && !request.getPersonalIds().isEmpty()) {
            Set<Usuario> personal = request.getPersonalIds().stream()
                .filter(id -> id != null && !id.isBlank())
                .map(id -> usuarioRepository.findById(id).orElse(null))
                .filter(usuario -> usuario != null)
                .collect(Collectors.toSet());
            departamento.setPersonal(personal);
        }
        
        return departamento;
    }
    
    /**
     * Actualiza una entidad Departamento existente con datos del DepartamentoRequest
     */
    public void updateEntity(Departamento departamento, DepartamentoRequest request) {
        if (departamento == null || request == null) {
            return;
        }
        
        departamento.setCodigo(request.getCodigo());
        departamento.setNombre(request.getNombre());
        departamento.setDescripcion(request.getDescripcion());
        departamento.setAmbito(request.getAmbito());
        departamento.setColorHex(request.getColorHex());
        
        // Actualizar jefe
        if (request.getJefeId() != null && !request.getJefeId().isBlank()) {
            usuarioRepository.findById(request.getJefeId())
                .ifPresent(departamento::setJefe);
        } else {
            departamento.setJefe(null);
        }
        
        // Actualizar personal
        if (request.getPersonalIds() != null) {
            Set<Usuario> personal = request.getPersonalIds().stream()
                .filter(id -> id != null && !id.isBlank())
                .map(id -> usuarioRepository.findById(id).orElse(null))
                .filter(usuario -> usuario != null)
                .collect(Collectors.toSet());
            departamento.setPersonal(personal);
        } else {
            if (departamento.getPersonal() != null) {
                departamento.getPersonal().clear();
            }
        }
    }
    
    /**
     * Mapea un Usuario a UsuarioResponse (versión simplificada)
     */
    private UsuarioResponse mapUsuarioToResponse(Usuario usuario) {
        if (usuario == null) {
            return null;
        }
        
        UsuarioResponse response = new UsuarioResponse();
        response.id = usuario.getId();
        response.nombre = usuario.getNombre();
        response.email = usuario.getEmail();
        response.rol = mapRolToResponse(usuario.getRol());
        
        return response;
    }
    
    /**
     * Mapea un Rol a RolResponse
     */
    private RolResponse mapRolToResponse(com.teatroreal.domain.user.Rol rol) {
        if (rol == null) {
            return null;
        }
        
        RolResponse response = new RolResponse();
        response.id = rol.getId();
        response.nombre = rol.getNombreStr();
        response.descripcion = rol.getDescripcion();
        response.permisos = rol.getPermisos() != null 
            ? rol.getPermisos().toArray(new String[0]) 
            : new String[0];
        
        return response;
    }
    
    /**
     * Convierte lista de entidades a lista de DTOs
     */
    public List<DepartamentoResponse> toResponseList(List<Departamento> departamentos) {
        if (departamentos == null) {
            return Collections.emptyList();
        }
        
        return departamentos.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
}
