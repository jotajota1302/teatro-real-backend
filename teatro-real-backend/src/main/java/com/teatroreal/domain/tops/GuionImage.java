package com.teatroreal.domain.tops;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entidad JPA para almacenar imágenes asociadas a guiones
 * Según reglas-tops1.md: Upload y almacenamiento de imágenes
 */
@Entity
@Table(name = "guion_images", indexes = {
        @Index(name = "idx_image_entity", columnList = "entity_type, entity_id"),
        @Index(name = "idx_image_guion", columnList = "guion_id"),
        @Index(name = "idx_image_uploaded", columnList = "uploaded_at DESC")
})
public class GuionImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long guionId;

    @Column(nullable = false, length = 50)
    private String entityType;

    @Column(nullable = false)
    private Long entityId;

    @Column(nullable = false, length = 255)
    private String filename;

    @Column(nullable = false, length = 100)
    private String mimeType;

    @Column(nullable = false)
    private Long fileSize;

    @Column(nullable = false, length = 500)
    private String storagePath;

    @Column(name = "uploaded_by")
    private Long uploadedBy;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    // Constructores
    public GuionImage() {
    }

    public GuionImage(Long guionId, String entityType, Long entityId, String filename,
                      String mimeType, Long fileSize, String storagePath, Long uploadedBy) {
        this.guionId = guionId;
        this.entityType = entityType;
        this.entityId = entityId;
        this.filename = filename;
        this.mimeType = mimeType;
        this.fileSize = fileSize;
        this.storagePath = storagePath;
        this.uploadedBy = uploadedBy;
        this.uploadedAt = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGuionId() {
        return guionId;
    }

    public void setGuionId(Long guionId) {
        this.guionId = guionId;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getStoragePath() {
        return storagePath;
    }

    public void setStoragePath(String storagePath) {
        this.storagePath = storagePath;
    }

    public Long getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(Long uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    @Override
    public String toString() {
        return "GuionImage{" +
                "id=" + id +
                ", guionId=" + guionId +
                ", entityType='" + entityType + '\'' +
                ", entityId=" + entityId +
                ", filename='" + filename + '\'' +
                ", mimeType='" + mimeType + '\'' +
                ", fileSize=" + fileSize +
                ", uploadedAt=" + uploadedAt +
                '}';
    }
}
