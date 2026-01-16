package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.Actividad;
import com.teatroreal.domain.tempo.ActividadDocumento;
import com.teatroreal.dto.response.ActividadDocumentoResponse;
import com.teatroreal.repository.tempo.ActividadDocumentoRepository;
import com.teatroreal.repository.tempo.ActividadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityNotFoundException;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ActividadDocumentoService {

    private final ActividadDocumentoRepository documentoRepository;
    private final ActividadRepository actividadRepository;

    public ActividadDocumentoResponse uploadDocumento(String actividadId, MultipartFile archivo, String origen) {
        Actividad actividad = actividadRepository.findById(actividadId)
                .orElseThrow(() -> new EntityNotFoundException("Actividad no encontrada"));

        String baseDir = "uploaded_docs";
        File dir = new File(baseDir);
        if (!dir.exists()) dir.mkdirs();

        String extension = archivo.getOriginalFilename() != null ? archivo.getOriginalFilename() : "file";
        String nombreAlmacenado = UUID.randomUUID() + "_" + extension;
        File destino = new File(dir, nombreAlmacenado);
        try (FileOutputStream fos = new FileOutputStream(destino)) {
            fos.write(archivo.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Error guardando archivo", e);
        }

        String url = "/files/" + nombreAlmacenado;

        ActividadDocumento doc = ActividadDocumento.builder()
                .actividad(actividad)
                .nombreArchivo(archivo.getOriginalFilename())
                .url(url)
                .origen(ActividadDocumento.OrigenDocumento.valueOf(origen))
                .build();

        doc = documentoRepository.save(doc);

        return toDto(doc);
    }

    public List<ActividadDocumentoResponse> listarPorActividad(String actividadId) {
        return documentoRepository.findByActividadId(actividadId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private ActividadDocumentoResponse toDto(ActividadDocumento doc) {
        return ActividadDocumentoResponse.builder()
                .id(doc.getId())
                .nombreArchivo(doc.getNombreArchivo())
                .url(doc.getUrl())
                .origen(doc.getOrigen().name())
                .fechaSubida(doc.getFechaSubida() != null ?
                        doc.getFechaSubida().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }
}
