-- V16__tops_fase2_features.sql
-- Implementación TOPS Fase 2: Columnas orden, Audit log, Tabla de imágenes, Corrección de colores
-- Fecha: 2026-02-04

-- =====================================================
-- 1. COLUMNAS 'orden' YA EXISTEN EN V6 (NO HACER NADA)
-- =====================================================

-- Las columnas orden ya fueron creadas en V6__tops_guiones_schema.sql
-- para actos, escenas, elementos_guion y pasada_items

-- =====================================================
-- 2. AMPLIAR COLUMNA tipo_elemento PARA NUEVOS TIPOS
-- =====================================================

ALTER TABLE colores_elemento_guion ALTER COLUMN tipo_elemento VARCHAR(50);

-- =====================================================
-- 3. CORREGIR COLORES SEGÚN ADDENDUM DE REGLAS-TOPS1.MD
-- =====================================================

-- Actualizar TOP a azul claro (instrucciones técnicas)
UPDATE colores_elemento_guion 
SET color_hex = '#BDD6EE', descripcion = 'Azul claro - Instrucciones técnicas'
WHERE tipo_elemento = 'TOP';

-- Actualizar ENTRADA a amarillo (Indicación E)
UPDATE colores_elemento_guion 
SET color_hex = '#FFE599', descripcion = 'Amarillo - Indicación Entrada (E)'
WHERE tipo_elemento = 'ENTRADA';

-- Actualizar MUTIS a blanco (Indicación M)
UPDATE colores_elemento_guion 
SET color_hex = '#FFFFFF', descripcion = 'Blanco - Indicación Mutis (M)'
WHERE tipo_elemento = 'MUTIS';

-- Actualizar INTERNO a verde claro (Indicación INT)
UPDATE colores_elemento_guion 
SET color_hex = '#E2EFD9', descripcion = 'Verde claro - Indicación Interna (INT)'
WHERE tipo_elemento = 'INTERNO';

-- =====================================================
-- 3. INSERTAR TIPOS DE ELEMENTO FALTANTES
-- =====================================================

INSERT INTO colores_elemento_guion (tipo_elemento, color_hex, descripcion) 
SELECT 'INSTRUCCION_TECNICA_PASADA', '#BDD6EE', 'Azul claro - Instrucción técnica Pasada'
WHERE NOT EXISTS (
    SELECT 1 FROM colores_elemento_guion WHERE tipo_elemento = 'INSTRUCCION_TECNICA_PASADA'
);

INSERT INTO colores_elemento_guion (tipo_elemento, color_hex, descripcion) 
SELECT 'PLANO_ESCENARIO', '#BDD6EE', 'Azul claro - Plano de escenario'
WHERE NOT EXISTS (
    SELECT 1 FROM colores_elemento_guion WHERE tipo_elemento = 'PLANO_ESCENARIO'
);

INSERT INTO colores_elemento_guion (tipo_elemento, color_hex, descripcion) 
SELECT 'ANOTACION_LIBRE', '#FFFFFF', 'Blanco - Anotación libre'
WHERE NOT EXISTS (
    SELECT 1 FROM colores_elemento_guion WHERE tipo_elemento = 'ANOTACION_LIBRE'
);

-- =====================================================
-- 4. CREAR TABLA audit_log PARA HISTORIAL DE CAMBIOS
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    action VARCHAR(20) NOT NULL,
    user_id VARCHAR(36),
    user_email VARCHAR(255),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    diff_json TEXT
);

-- Crear índices para audit_log
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);

-- =====================================================
-- 5. CREAR TABLA guion_images PARA ALMACENAMIENTO DE IMÁGENES
-- =====================================================

CREATE TABLE IF NOT EXISTS guion_images (
    id BIGSERIAL PRIMARY KEY,
    guion_id BIGINT NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    uploaded_by BIGINT,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_image_guion FOREIGN KEY (guion_id) REFERENCES guiones(id) ON DELETE CASCADE,
    CONSTRAINT fk_image_uploader FOREIGN KEY (uploaded_by) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Crear índices para guion_images
CREATE INDEX IF NOT EXISTS idx_image_entity ON guion_images(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_image_guion ON guion_images(guion_id);
CREATE INDEX IF NOT EXISTS idx_image_uploaded ON guion_images(uploaded_at DESC);

-- =====================================================
-- 6. REGISTRAR EN AUDIT_LOG LA EJECUCIÓN DE ESTA MIGRACIÓN
-- =====================================================

INSERT INTO audit_log (entity_type, entity_id, action, user_email, timestamp, diff_json)
VALUES (
    'MIGRATION',
    'V16',
    'EXECUTE',
    'system@teatro-real.es',
    CURRENT_TIMESTAMP,
    '{"version": "V16", "description": "TOPS Fase 2 Features: orden, audit_log, guion_images, corrección colores"}'
);
