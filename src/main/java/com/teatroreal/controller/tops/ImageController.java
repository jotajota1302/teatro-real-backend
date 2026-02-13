package com.teatroreal.controller.tops;

import com.teatroreal.domain.tops.GuionImage;
import com.teatroreal.service.tops.GuionImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

/**
 * Controller REST para gestión de imágenes en TOPS
 * Endpoints para upload, download y listado de imágenes
 */
@RestController
@RequestMapping("/api/tops/images")
@RequiredArgsConstructor
public class ImageController {

    private final GuionImageService guionImageService;

    @Value("${app.upload.dir:./uploads/guiones}")
    private String uploadBaseDir;

    /**
     * POST /api/tops/images/upload
     * Sube una imagen asociada a un elemento del guion
     *
     * @param file Archivo de imagen (jpg, png, gif)
     * @param guionId ID del guión
     * @param entityType Tipo de entidad (TOP, PASADA_ITEM, ESCENA)
     * @param entityId ID de la entidad
     * @return Metadata de la imagen subida
     */
    @PostMapping("/upload")
    public ResponseEntity<GuionImage> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("guionId") String guionId,
            @RequestParam("entityType") String entityType,
            @RequestParam("entityId") String entityId) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Validar tipo MIME
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).build();
        }

        try {
            GuionImage savedImage = guionImageService.uploadImage(
                    file, guionId, entityType, entityId, null // Usuario opcional
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(savedImage);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET /api/tops/images/{id}
     * Descarga una imagen por ID (intenta filesystem first, luego BD)
     */
    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        try {
            GuionImage image = guionImageService.obtenerImagen(id);

            // Intentar servir copia en filesystem si existe
            if (uploadBaseDir != null && !uploadBaseDir.isBlank()) {
                Path base = Paths.get(uploadBaseDir).toAbsolutePath().normalize();
                Path guionDir = base.resolve(image.getGuionId());
                if (Files.exists(guionDir) && Files.isDirectory(guionDir)) {
                    try (Stream<Path> stream = Files.list(guionDir)) {
                        Optional<Path> match = stream
                                .filter(p -> p.getFileName().toString().startsWith(image.getId() + "_"))
                                .findFirst();
                        if (match.isPresent()) {
                            byte[] data = Files.readAllBytes(match.get());
                            return ResponseEntity.ok()
                                    .contentType(MediaType.parseMediaType(image.getMimeType()))
                                    .header(HttpHeaders.CONTENT_DISPOSITION,
                                            "inline; filename=\"" + image.getFilename() + "\"")
                                    .header(HttpHeaders.CACHE_CONTROL, "max-age=86400") // Cache 1 día
                                    .body(data);
                        }
                    } catch (IOException ignored) {
                        // ignore and fallback to DB bytes
                    }
                }
            }

            // Fallback: servir desde BD (BLOB)
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(image.getMimeType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + image.getFilename() + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=86400") // Cache 1 día
                    .body(image.getImageData());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/tops/images/entity/{entityType}/{entityId}
     * Lista todas las imágenes de una entidad
     */
    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<List<GuionImage>> getImagesByEntity(
            @PathVariable String entityType,
            @PathVariable String entityId) {
        List<GuionImage> images = guionImageService.obtenerImagenesPorEntidad(entityType, entityId);
        return ResponseEntity.ok(images);
    }

    /**
     * GET /api/tops/images/guion/{guionId}
     * Lista todas las imágenes de un guión
     */
    @GetMapping("/guion/{guionId}")
    public ResponseEntity<List<GuionImage>> getImagesByGuion(@PathVariable String guionId) {
        List<GuionImage> images = guionImageService.obtenerImagenesPorGuion(guionId);
        return ResponseEntity.ok(images);
    }

    /**
     * DELETE /api/tops/images/{id}
     * Elimina una imagen
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        try {
            guionImageService.eliminarImagen(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
