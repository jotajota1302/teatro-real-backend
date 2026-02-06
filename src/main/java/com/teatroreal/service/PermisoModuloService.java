package com.teatroreal.service;

import com.teatroreal.domain.user.PermisoModulo;
import com.teatroreal.repository.PermisoModuloRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermisoModuloService {
    private final PermisoModuloRepository permisoModuloRepository;
    public PermisoModuloService(PermisoModuloRepository permisoModuloRepository) { this.permisoModuloRepository = permisoModuloRepository; }
    public List<PermisoModulo> findAll() { return permisoModuloRepository.findAll(); }
}
