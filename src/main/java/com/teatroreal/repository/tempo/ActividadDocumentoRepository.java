package com.teatroreal.repository.tempo;

import com.teatroreal.domain.tempo.ActividadDocumento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActividadDocumentoRepository extends JpaRepository<ActividadDocumento, Long> {
    List<ActividadDocumento> findByActividadId(String actividadId);
}
