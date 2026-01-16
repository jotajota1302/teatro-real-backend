package com.teatroreal.repository.tempo;

import com.teatroreal.domain.tempo.ActividadDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActividadDocumentoRepository extends JpaRepository<ActividadDocumento, String> {
    List<ActividadDocumento> findByActividadId(String actividadId);
}
