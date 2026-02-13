package com.teatroreal.service.tops;

import com.teatroreal.domain.tops.GuionImage;
import com.teatroreal.repository.tops.GuionImageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/**
 * Servicio para gestionar imágenes de guiones
 * Almacena imágenes directamente en la base de datos (BLOB) y, como copia opcional,
 * guarda una copia en filesystem bajo app.upload.dir para verificación/preview si está configurado.
 *
 * Ahora sincroniza la eliminación: cuando se borra la entidad en BD, intenta eliminar la copia en disco.
 */
@Service
@Transactional
public class GuionImageService {

    private static final Logger log = LoggerFactory.getLogger(GuionImageService.class);

    private final GuionImageRepository guionImageRepository;

    @Value("${app.upload.max-size:10485760}")  // 10MB por defecto
    private long maxFileSize;

    /**
     * Directorio base para copias en disco. Si está vacío o no existe, intentar crear.
     * Valor por defecto tomado desde application.properties: app.upload.dir
     */
    @Value("${app.upload.dir:./uploads/guiones}")
    private String uploadBaseDir;

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
     * Sube una imagen y la almacena en la base de datos (BLOB).
     * Además escribe una copia en filesystem (si uploadBaseDir está configurado) para
     * facilitar verificaciones y previews sin necesidad de descargar de la BD.
     *
     * @param file       Archivo de imagen
     * @param guionId    ID del guion
     * @param entityType Tipo de entidad (TOP, PASADA_ITEM, ESCENA, etc.)
     * @param entityId   ID de la entidad
     * @param uploadedBy ID del usuario que sube la imagen
     * @return GuionImage creada (con id generado)
     * @throws IOException              Si hay error al leer el archivo
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

        byte[] bytes = file.getBytes();

        // Crear y guardar registro en BD con los bytes de la imagen
        GuionImage imagen = new GuionImage(
                guionId,
                entityType,
                entityId,
                file.getOriginalFilename(),
                file.getContentType(),
                file.getSize(),
                bytes,  // Guardar bytes directamente en DB
                uploadedBy
        );

        GuionImage saved = guionImageRepository.save(imagen);

        // Intentar guardar copia en filesystem para previews (no fatal)
        try {
            saveCopyToFilesystem(saved, bytes);
        } catch (Exception e) {
            log.warn("No se pudo guardar copia en filesystem para imagen id={} (no es fatal): {}", saved.getId(), e.getMessage());
        }

        return saved;
    }

    private void saveCopyToFilesystem(GuionImage saved, byte[] bytes) throws IOException {
        if (uploadBaseDir == null || uploadBaseDir.isBlank()) {
            // no configured - skip
            return;
        }

        // directorio: {uploadBaseDir}/{guionId}/
        Path base = Paths.get(uploadBaseDir).toAbsolutePath().normalize();
        Path guionDir = base.resolve(saved.getGuionId());
        Files.createDirectories(guionDir);

        // nombre fichero seguro: {id}_{filename}
        String safeFilename = saved.getId() + "_" + sanitizeFilename(saved.getFilename());
        Path target = guionDir.resolve(safeFilename);

        Files.write(target, bytes);

        log.debug("Copia de imagen guardada en disco: {}", target.toString());
    }

    private String sanitizeFilename(String filename) {
        if (filename == null) {
            return "unnamed";
        }
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
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
     * Elimina una imagen (BD) y su copia en filesystem si existe.
     */
    public void eliminarImagen(Long imagenId) {
        GuionImage image = guionImageRepository.findById(imagenId)
                .orElseThrow(() -> new IllegalArgumentException("Imagen no encontrada: " + imagenId));

        // Intentar eliminar copia en filesystem (no fatal)
        try {
            deleteCopyFromFilesystem(image);
        } catch (Exception e) {
            log.warn("No se pudo borrar copia en filesystem para imagen id={} : {}", imagenId, e.getMessage());
        }

        guionImageRepository.deleteById(imagenId);
    }

    /**
     * Elimina todas las imágenes de una entidad (BD) y sus copias en filesystem.
     */
    public void eliminarImagenesPorEntidad(String entityType, String entityId) {
        List<GuionImage> imgs = guionImageRepository.findByEntityTypeAndEntityId(entityType, entityId);
        for (GuionImage img : imgs) {
            try {
                deleteCopyFromFilesystem(img);
            } catch (Exception e) {
                log.warn("No se pudo borrar copia en filesystem para imagen id={} : {}", img.getId(), e.getMessage());
            }
        }
        guionImageRepository.deleteByEntityTypeAndEntityId(entityType, entityId);
    }

    /**
     * Elimina todas las imágenes de un guion (BD) y sus copias en filesystem.
     */
    public void eliminarImagenesPorGuion(String guionId) {
        List<GuionImage> imgs = guionImageRepository.findByGuionId(guionId);
        for (GuionImage img : imgs) {
            try {
                deleteCopyFromFilesystem(img);
            } catch (Exception e) {
                log.warn("No se pudo borrar copia en filesystem para imagen id={} : {}", img.getId(), e.getMessage());
            }
        }
        guionImageRepository.deleteByGuionId(guionId);

        // Intentar borrar directorio del guion si está vacío
        try {
            if (uploadBaseDir != null && !uploadBaseDir.isBlank()) {
                Path base = Paths.get(uploadBaseDir).toAbsolutePath().normalize();
                Path guionDir = base.resolve(guionId);
                if (Files.exists(guionDir) && Files.isDirectory(guionDir)) {
                    try (DirectoryStream<Path> ds = Files.newDirectoryStream(guionDir)) {
                        if (!ds.iterator().hasNext()) {
                            Files.delete(guionDir);
                            log.debug("Directorio de guion eliminado: {}", guionDir);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Error eliminando directorio de guion {}: {}", guionId, e.getMessage());
        }
    }

    private void deleteCopyFromFilesystem(GuionImage image) {
        if (uploadBaseDir == null || uploadBaseDir.isBlank()) {
            return;
        }
        try {
            Path base = Paths.get(uploadBaseDir).toAbsolutePath().normalize();
            Path guionDir = base.resolve(image.getGuionId());
            if (!Files.exists(guionDir) || !Files.isDirectory(guionDir)) {
                return;
            }
            String prefix = image.getId() + "_";
            try (DirectoryStream<Path> stream = Files.newDirectoryStream(guionDir, prefix + "*")) {
                for (Path p : stream) {
                    try {
                        Files.deleteIfExists(p);
                        log.debug("Eliminada copia en disco: {}", p);
                    } catch (Exception ex) {
                        log.warn("No se pudo eliminar fichero {}: {}", p, ex.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Error buscando/copias en filesystem para imagen id={} : {}", image.getId(), e.getMessage());
        }
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
            if (allowed.equalsIgnoreCase(mimeType)) {
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
