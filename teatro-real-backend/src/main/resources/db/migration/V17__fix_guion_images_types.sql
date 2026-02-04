-- =====================================================
-- V17: Corregir tipos en guion_images
-- Los IDs en el sistema usan VARCHAR(36) (UUID), no BIGINT
-- =====================================================

-- Eliminar tabla existente (no hay datos en producción aún)
DROP TABLE IF EXISTS guion_images;

-- Recrear con tipos correctos
CREATE TABLE guion_images (
    id BIGSERIAL PRIMARY KEY,
    guion_id VARCHAR(36) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
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
INSERT INTO audit_log (entity_type, entity_id, action, user_email, timestamp, diff_json)
VALUES (
    'MIGRATION',
    'V17',
    'EXECUTE',
    'system@teatro-real.es',
    CURRENT_TIMESTAMP,
    '{"version": "V17", "description": "Fix guion_images types: BIGINT -> VARCHAR(36) for UUID compatibility"}'
);
