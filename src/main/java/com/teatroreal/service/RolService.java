package com.teatroreal.service;

import com.teatroreal.domain.user.Rol;
import com.teatroreal.repository.RolRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolService {
    private final RolRepository rolRepository;
    public RolService(RolRepository rolRepository) { this.rolRepository = rolRepository; }
    public List<Rol> findAll() { return rolRepository.findAll(); }
}
