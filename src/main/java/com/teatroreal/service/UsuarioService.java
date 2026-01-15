package com.teatroreal.service;

import com.teatroreal.domain.user.Usuario;
import com.teatroreal.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) { 
        this.usuarioRepository = usuarioRepository; 
    }

    public void delete(String id) {
        Usuario existente = usuarioRepository.findById(id)
            .orElseThrow(() -> new javax.persistence.EntityNotFoundException("Usuario no encontrado"));
        usuarioRepository.deleteById(id);
    }

    public List<Usuario> findAll() { 
        return usuarioRepository.findAll(); 
    }
    public Usuario findById(String id) { 
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new javax.persistence.EntityNotFoundException("Usuario no encontrado")); 
    }
    public Usuario create(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario update(String id, Usuario usuario) {
        Usuario existente = usuarioRepository.findById(id)
            .orElseThrow(() -> new javax.persistence.EntityNotFoundException("Usuario no encontrado"));

        existente.setNombre(usuario.getNombre());
        existente.setEmail(usuario.getEmail());
        existente.setAvatarUrl(usuario.getAvatarUrl());
        existente.setRol(usuario.getRol());
        existente.setDepartamento(usuario.getDepartamento());
        existente.setActivo(usuario.getActivo());
        existente.setUltimoAcceso(usuario.getUltimoAcceso());
        // No modificamos id, createdAt, updatedAt directamente

        return usuarioRepository.save(existente);
    }
}
