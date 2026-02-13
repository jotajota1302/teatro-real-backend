-- V19__tops_add_tipo_seccion_escena.sql
-- Añade tipo de sección en escenas para soportar ESCENA / PAUSA

ALTER TABLE escenas
ADD COLUMN IF NOT EXISTS tipo_seccion VARCHAR(20) NOT NULL DEFAULT 'ESCENA';

UPDATE escenas
SET tipo_seccion = 'ESCENA'
WHERE tipo_seccion IS NULL OR TRIM(tipo_seccion) = '';

