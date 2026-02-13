-- ===============================
-- V2: Datos de semilla iniciales
-- ===============================

-- Roles base (ADMIN, GESTOR, OPERADOR, VISUALIZADOR)
MERGE INTO roles (id, nombre, descripcion, permisos) KEY(nombre) VALUES
  (1, 'ADMIN', 'Usuario con acceso total al sistema', 'ALL'),
  (2, 'GESTOR', 'Gestor con permisos de CRUD ampliados', 'CRUD'),
  (3, 'OPERADOR', 'Operador con edicion propia', 'READ,EDIT_OWN'),
  (4, 'VISUALIZADOR', 'Solo lectura', 'READ');

-- Temporada inicial estandar (ejemplo: "2025-2026")
MERGE INTO temporadas (id, nombre, fecha_inicio, fecha_fin, activa) KEY(nombre) VALUES
  (1, '2025-2026', '2025-08-01', '2026-07-31', true);
