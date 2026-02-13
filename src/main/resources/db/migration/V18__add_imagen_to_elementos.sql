-- V18: Add imagen column to elementos_guion table
-- Permite almacenar URL de imagen en cada elemento del guion
-- (Solo si no existe ya)

ALTER TABLE elementos_guion ADD COLUMN IF NOT EXISTS imagen VARCHAR(500);
