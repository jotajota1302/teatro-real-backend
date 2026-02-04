package com.teatroreal.service.tops;

import com.teatroreal.domain.tops.GuionImage;
import com.teatroreal.repository.tops.GuionImageRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

/**
 * Servicio para gestionar imágenes de guiones
 * Según reglas-tops1.md: Upload y almacenamiento de imágenes
 */
@Service
@Transactional
public class GuionImageService {

    private final GuionImageRepository guionImageRepository;

    @Value("${app.upload.dir:./uploads/guiones}")
    private String uploadDir;

    @Value("${app.upload.max-size:5242880}")  // 5MB por defecto
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
     * Sube una imagen y la asocia a una entidad de guion
     *
     * @param file Archivo de imagen
     * @param guionId ID del guion
     * @param entityType Tipo de entidad (TOP, PASADA_ITEM, ESCENA, etc.)
     * @param entityId ID de la entidad
     * @param uploadedBy ID del usuario que sube la imagen
     * @return GuionImage creada
     * @throws IOException Si hay error al guardar el archivo
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

        // Crear directorio si no existe
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);

        // Generar nombre único
        String nombreUnico = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path rutaArchivo = uploadPath.resolve(nombreUnico);

        // Guardar archivo
        Files.write(rutaArchivo, file.getBytes());

        // Crear y guardar registro en BD
        GuionImage imagen = new GuionImage(
                guionId,
                entityType,
                entityId,
                file.getOriginalFilename(),
                file.getContentType(),
                file.getSize(),
                rutaArchivo.toString(),
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
        GuionImage imagen = obtenerImagen(imagenId);

        // Eliminar archivo del sistema de archivos
        try {
            Path rutaArchivo = Paths.get(imagen.getStoragePath());
            Files.deleteIfExists(rutaArchivo);
        } catch (IOException e) {
            // Log pero no fallar
            System.err.println("Error al eliminar archivo: " + imagen.getStoragePath());
        }

        // Eliminar registro de BD
        guionImageRepository.deleteById(imagenId);
    }

    /**
     * Elimina todas las imágenes de una entidad
     */
    public void eliminarImagenesPorEntidad(String entityType, String entityId) {
        List<GuionImage> imagenes = guionImageRepository.findByEntityTypeAndEntityId(entityType, entityId);

        imagenes.forEach(imagen -> {
            try {
                Path rutaArchivo = Paths.get(imagen.getStoragePath());
                Files.deleteIfExists(rutaArchivo);
            } catch (IOException e) {
                System.err.println("Error al eliminar archivo: " + imagen.getStoragePath());
            }
        });

        guionImageRepository.deleteByEntityTypeAndEntityId(entityType, entityId);
    }

    /**
     * Elimina todas las imágenes de un guion
     */
    public void eliminarImagenesPorGuion(String guionId) {
        List<GuionImage> imagenes = guionImageRepository.findByGuionId(guionId);

        imagenes.forEach(imagen -> {
            try {
                Path rutaArchivo = Paths.get(imagen.getStoragePath());
                Files.deleteIfExists(rutaArchivo);
            } catch (IOException e) {
                System.err.println("Error al eliminar archivo: " + imagen.getStoragePath());
            }
        });

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

    /**
     * Obtiene la ruta del archivo para servir
     */
    public Path obtenerRutaArchivo(Long imagenId) {
        GuionImage imagen = obtenerImagen(imagenId);
        return Paths.get(imagen.getStoragePath());
    }
}
