package com.teatroreal.service.tops;

import com.teatroreal.domain.tops.GuionImage;
import com.teatroreal.repository.tops.GuionImageRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * Servicio para gestionar imágenes de guiones
 * Almacena imágenes directamente en la base de datos (BLOB)
 */
@Service
@Transactional
public class GuionImageService {

    private final GuionImageRepository guionImageRepository;

    @Value("${app.upload.max-size:10485760}")  // 10MB por defecto
    private long maxFileSize;

    // MIME types permitidos
    private static final String[] ALLOWED_MIME_TYPES = {
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp"
    };

    public GuionImageService(GuionImageRepository guionImageRepository) {
        this.guionImageRepository = guionImageRepository;
    }

    /**
     * Sube una imagen y la almacena en la base de datos
     *
     * @param file Archivo de imagen
     * @param guionId ID del guion
     * @param entityType Tipo de entidad (TOP, PASADA_ITEM, ESCENA, etc.)
     * @param entityId ID de la entidad
     * @param uploadedBy ID del usuario que sube la imagen
     * @return GuionImage creada
     * @throws IOException Si hay error al leer el archivo
     * @throws IllegalArgumentException Si el archivo es inválido
     */
    public GuionImage uploadImage(
            MultipartFile file,
            String guionId,
            String entityType,
            String entityId,
            Long uploadedBy
    ) throws IOException {
        // Validar archivo
        validarArchivo(file);

        // Crear y guardar registro en BD con los bytes de la imagen
        GuionImage imagen = new GuionImage(
                guionId,
                entityType,
                entityId,
                file.getOriginalFilename(),
                file.getContentType(),
                file.getSize(),
                file.getBytes(),  // Guardar bytes directamente
                uploadedBy
        );

        return guionImageRepository.save(imagen);
    }

    /**
     * Obtiene todas las imágenes de una entidad
     */
    public List<GuionImage> obtenerImagenesPorEntidad(String entityType, String entityId) {
        return guionImageRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }

    /**
     * Obtiene todas las imágenes de un guion
     */
    public List<GuionImage> obtenerImagenesPorGuion(String guionId) {
        return guionImageRepository.findByGuionId(guionId);
    }

    /**
     * Obtiene una imagen específica por ID
     */
    public GuionImage obtenerImagen(Long imagenId) {
        return guionImageRepository.findById(imagenId)
                .orElseThrow(() -> new IllegalArgumentException("Imagen no encontrada: " + imagenId));
    }

    /**
     * Elimina una imagen
     */
    public void eliminarImagen(Long imagenId) {
        if (!guionImageRepository.existsById(imagenId)) {
            throw new IllegalArgumentException("Imagen no encontrada: " + imagenId);
        }
        guionImageRepository.deleteById(imagenId);
    }

    /**
     * Elimina todas las imágenes de una entidad
     */
    public void eliminarImagenesPorEntidad(String entityType, String entityId) {
        guionImageRepository.deleteByEntityTypeAndEntityId(entityType, entityId);
    }

    /**
     * Elimina todas las imágenes de un guion
     */
    public void eliminarImagenesPorGuion(String guionId) {
        guionImageRepository.deleteByGuionId(guionId);
    }

    /**
     * Valida que el archivo sea válido
     */
    private void validarArchivo(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException(
                    "El archivo es demasiado grande. Máximo: " + (maxFileSize / 1024 / 1024) + "MB"
            );
        }

        String mimeType = file.getContentType();
        boolean esValido = false;
        for (String allowed : ALLOWED_MIME_TYPES) {
            if (allowed.equals(mimeType)) {
                esValido = true;
                break;
            }
        }

        if (!esValido) {
            throw new IllegalArgumentException(
                    "Tipo de archivo no permitido. Soportados: JPEG, PNG, GIF, WebP"
            );
        }
    }

}
