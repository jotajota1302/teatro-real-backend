package com.teatroreal.service;

import com.teatroreal.domain.user.Usuario;
import com.teatroreal.repository.UsuarioRepository;
<<<<<<< HEAD
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
=======

import java.util.List;

public class UsuarioService {
    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public Usuario findById(String id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new java.util.NoSuchElementException("Usuario no encontrado con id: " + id));
    }

>>>>>>> 5f5ad938ebc041f2e716139a5623612b8f844e98
    public Usuario create(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario update(String id, Usuario usuario) {
<<<<<<< HEAD
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
=======
        Usuario existing = usuarioRepository.findById(id)
            .orElseThrow(() -> new java.util.NoSuchElementException("Usuario no encontrado con id: " + id));

        existing.setNombre(usuario.getNombre());
        existing.setEmail(usuario.getEmail());
        existing.setActivo(usuario.getActivo());
        existing.setRol(usuario.getRol());
        existing.setDepartamento(usuario.getDepartamento());
        existing.setAvatarUrl(usuario.getAvatarUrl());
        existing.setUltimoAcceso(usuario.getUltimoAcceso());

        return usuarioRepository.save(existing);
    }

    public void delete(String id) {
        usuarioRepository.deleteById(id);
>>>>>>> 5f5ad938ebc041f2e716139a5623612b8f844e98
    }
}
