package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.Actividad;
import com.teatroreal.domain.tempo.ActividadDocumento;
import com.teatroreal.domain.tempo.ActividadDocumento.Origen;
import com.teatroreal.repository.tempo.ActividadDocumentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ActividadDocumentoService {

    private final ActividadDocumentoRepository repository;
    private final ActividadService actividadService;

    public List<ActividadDocumento> findByActividadId(String actividadId) {
        return repository.findByActividadId(actividadId);
    }

    // Guarda el fichero físico en carpeta docs_local/ y retorna la URL de acceso simulada
    public ActividadDocumento uploadArchivo(String actividadId, MultipartFile file, Origen origen) throws IOException {
        Actividad actividad = actividadService.findById(actividadId);
        String nombreFinal = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String urlArchivo = "/docs_local/" + nombreFinal;

        // No guardo el archivo realmente, sólo simulo para ejemplo
        ActividadDocumento documento = new ActividadDocumento();
        documento.setActividad(actividad);
        documento.setNombreArchivo(file.getOriginalFilename());
        documento.setUrlArchivo(urlArchivo);
        documento.setOrigen(origen);

        return repository.save(documento);
    }
}
