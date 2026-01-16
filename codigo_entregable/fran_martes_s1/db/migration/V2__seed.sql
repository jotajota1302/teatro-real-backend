-- ===============================
-- V2: Datos de semilla iniciales
-- ===============================

-- Roles base (ADMIN, GESTOR, OPERADOR, VISUALIZADOR)
INSERT INTO roles (nombre, descripcion, permisos) VALUES
  ('ADMIN', 'Usuario con acceso total al sistema', 'ALL'),
  ('GESTOR', 'Gestor con permisos de CRUD ampliados', 'CRUD'),
  ('OPERADOR', 'Operador con edición propia', 'READ,EDIT_OWN'),
  ('VISUALIZADOR', 'Solo lectura', 'READ')
ON CONFLICT (nombre) DO NOTHING;

-- Temporada inicial estándar (ejemplo: "2025-2026")
INSERT INTO temporadas (nombre, fecha_inicio, fecha_fin, activa) VALUES
  ('2025-2026', '2025-08-01', '2026-07-31', true)
ON CONFLICT (nombre) DO NOTHING;
