package com.teatroreal.repository;

import com.teatroreal.domain.user.PermisoModulo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PermisoModuloRepository extends JpaRepository<PermisoModulo, Long> {
    List<PermisoModulo> findByUsuarioId(String usuarioId);
    Optional<PermisoModulo> findByUsuarioIdAndModulo(String usuarioId, PermisoModulo.Modulo modulo);
    void deleteByUsuarioId(String usuarioId);
}
