-- ===============================
-- V15: Fix nivel_acceso values - 'ADMIN' is not valid, use 'COMPLETO'
-- ===============================

-- Update all invalid 'ADMIN' values to 'COMPLETO'
UPDATE permisos_modulo SET nivel_acceso = 'COMPLETO' WHERE nivel_acceso = 'ADMIN';
