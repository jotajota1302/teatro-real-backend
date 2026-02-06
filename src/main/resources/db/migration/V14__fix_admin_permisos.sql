-- ===============================
-- V14: Fix admin module permissions
-- ===============================

-- Delete invalid LOGISTICA permission (not in enum)
DELETE FROM permisos_modulo WHERE modulo = 'LOGISTICA';

-- Add ADMIN module permission for admin user
MERGE INTO permisos_modulo (id, usuario_id, modulo, nivel_acceso) KEY(usuario_id, modulo) VALUES
    (4, 'admin-001-uuid', 'ADMIN', 'COMPLETO');
