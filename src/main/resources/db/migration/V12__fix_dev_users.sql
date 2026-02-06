-- ===============================
-- V12: Fix dev users with passwords
-- ===============================

-- BCrypt hash for 'password123': $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- Ensure admin has password
UPDATE usuarios SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE email = 'admin@teatroreal.es' AND (password_hash IS NULL OR password_hash = '');

-- Create TEMPO user if not exists (rol_id=2 GESTOR)
MERGE INTO usuarios (id, email, nombre, rol_id, activo, password_hash) KEY(email) VALUES
    ('tempo-001-uuid', 'tempo@teatroreal.es', 'Usuario TEMPO', 2, TRUE, '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

-- Create TOPS user if not exists (rol_id=2 GESTOR)
MERGE INTO usuarios (id, email, nombre, rol_id, activo, password_hash) KEY(email) VALUES
    ('tops-001-uuid', 'tops@teatroreal.es', 'Usuario TOPS', 2, TRUE, '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

-- Permisos para usuarios de desarrollo (IDs 100+ para evitar conflictos con V3)
MERGE INTO permisos_modulo (id, usuario_id, modulo, nivel_acceso) KEY(usuario_id, modulo) VALUES
    (100, 'tempo-001-uuid', 'TEMPO', 'ADMIN'),
    (101, 'tops-001-uuid', 'TOPS', 'ADMIN');
