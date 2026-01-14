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

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public Usuario findById(String id) {
        return usuarioRepository.findById(id).orElseThrow();
    }

    public Usuario create(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario update(String id, Usuario usuario) {
        Usuario existing = usuarioRepository.findById(id).orElseThrow();

        existing.setNombre(usuario.getNombre());
        existing.setEmail(usuario.getEmail());
        existing.setActivo(usuario.isActivo());
        existing.setRol(usuario.getRol());
        existing.setDepartamento(usuario.getDepartamento());
        existing.setAvatarUrl(usuario.getAvatarUrl());
        existing.setUltimoAcceso(usuario.getUltimoAcceso());

        return usuarioRepository.save(existing);
    }

    public void delete(String id) {
        usuarioRepository.deleteById(id);
    }
}
