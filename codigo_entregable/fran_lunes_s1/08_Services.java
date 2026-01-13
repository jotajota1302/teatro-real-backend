package com.teatroreal.service;

import com.teatroreal.domain.user.Usuario;
import com.teatroreal.domain.user.Rol;
import com.teatroreal.domain.tempo.Departamento;
import com.teatroreal.domain.tempo.Temporada;
import com.teatroreal.domain.user.PermisoModulo;
import com.teatroreal.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    public UsuarioService(UsuarioRepository usuarioRepository) { this.usuarioRepository = usuarioRepository; }
    public List<Usuario> findAll() { return usuarioRepository.findAll(); }
    public Usuario findById(String id) { return usuarioRepository.findById(id).orElseThrow(); }
}

@Service
public class RolService {
    private final RolRepository rolRepository;
    public RolService(RolRepository rolRepository) { this.rolRepository = rolRepository; }
    public List<Rol> findAll() { return rolRepository.findAll(); }
}

@Service
public class DepartamentoService {
    private final DepartamentoRepository departamentoRepository;
    public DepartamentoService(DepartamentoRepository departamentoRepository) { this.departamentoRepository = departamentoRepository; }
    public List<Departamento> findAll() { return departamentoRepository.findAll(); }
}

@Service
public class TemporadaService {
    private final TemporadaRepository temporadaRepository;
    public TemporadaService(TemporadaRepository temporadaRepository) { this.temporadaRepository = temporadaRepository; }
    public List<Temporada> findAll() { return temporadaRepository.findAll(); }
}

@Service
public class PermisoModuloService {
    private final PermisoModuloRepository permisoModuloRepository;
    public PermisoModuloService(PermisoModuloRepository permisoModuloRepository) { this.permisoModuloRepository = permisoModuloRepository; }
    public List<PermisoModulo> findAll() { return permisoModuloRepository.findAll(); }
}
