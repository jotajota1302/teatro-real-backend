-- ==========================================================
-- V20: Seed usuarios mock para formulario de departamentos
-- ==========================================================
-- Objetivo:
-- - Permitir que jefeId/personalIds mock (u1..u4) se resuelvan en backend.
-- - Mantener consistencia con el formulario actual de Departamentos.

-- BCrypt hash para 'password123'
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

MERGE INTO usuarios (id, email, nombre, rol_id, activo, password_hash) KEY(id) VALUES
  ('u1', 'laura.soto.mock@teatroreal.es', 'Laura Soto', 2, TRUE, '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
  ('u2', 'marcos.vela.mock@teatroreal.es', 'Marcos Vela', 3, TRUE, '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
  ('u3', 'nuria.perez.mock@teatroreal.es', 'Nuria Perez', 2, TRUE, '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
  ('u4', 'javi.diaz.mock@teatroreal.es', 'Javi Diaz', 3, TRUE, '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
