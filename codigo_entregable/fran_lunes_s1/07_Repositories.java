package com.teatroreal.repository;

import com.teatroreal.domain.user.Usuario;
import com.teatroreal.domain.user.Rol;
import com.teatroreal.domain.tempo.Departamento;
import com.teatroreal.domain.tempo.Temporada;
import com.teatroreal.domain.user.PermisoModulo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, String> {}
public interface RolRepository extends JpaRepository<Rol, Long> {}
public interface DepartamentoRepository extends JpaRepository<Departamento, Long> {}
public interface TemporadaRepository extends JpaRepository<Temporada, Long> {}
public interface PermisoModuloRepository extends JpaRepository<PermisoModulo, Long> {}
