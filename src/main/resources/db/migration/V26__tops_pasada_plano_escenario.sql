-- V20__tops_pasada_plano_escenario.sql
-- Añade soporte para filas de tipo plano de escenario en Pasada

ALTER TABLE pasada_items
ADD COLUMN IF NOT EXISTS tipo_item VARCHAR(30) NOT NULL DEFAULT 'INSTRUCCION_TECNICA';

ALTER TABLE pasada_items
ADD COLUMN IF NOT EXISTS titulo_plano VARCHAR(255);

UPDATE pasada_items
SET tipo_item = 'INSTRUCCION_TECNICA'
WHERE tipo_item IS NULL OR TRIM(tipo_item) = '';

