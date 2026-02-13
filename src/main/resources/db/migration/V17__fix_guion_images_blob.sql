-- =====================================================
-- V17: Recrear guion_images con almacenamiento BLOB
-- - Cambia IDs de BIGINT a VARCHAR(36) para UUIDs
-- - Almacena imágenes como BLOB en lugar de archivos
-- =====================================================

-- Eliminar tabla existente (no hay datos en producción aún)
DROP TABLE IF EXISTS guion_images;

-- Recrear con almacenamiento BLOB
CREATE TABLE guion_images (
    id BIGSERIAL PRIMARY KEY,
    guion_id VARCHAR(36) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    image_data BLOB NOT NULL,
    uploaded_by BIGINT,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_image_guion FOREIGN KEY (guion_id) REFERENCES guiones(id) ON DELETE CASCADE,
    CONSTRAINT fk_image_uploader FOREIGN KEY (uploaded_by) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Recrear índices
CREATE INDEX idx_image_entity ON guion_images(entity_type, entity_id);
CREATE INDEX idx_image_guion ON guion_images(guion_id);
CREATE INDEX idx_image_uploaded ON guion_images(uploaded_at DESC);

-- Registrar migración
-- Asegurar columnas necesarias en audit_log para BD antiguas
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS entity_type VARCHAR(50);
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS entity_id VARCHAR(36);

-- Nota: se omite el INSERT en audit_log para compatibilidad entre esquemas legacy
-- donde la tabla puede tener variantes de columnas obligatorias (entity_type vs entidad_tipo).
