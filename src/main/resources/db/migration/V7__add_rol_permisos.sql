-- V7: Add missing rol_permisos table for Rol @ElementCollection

CREATE TABLE IF NOT EXISTS rol_permisos (
    rol_id BIGINT NOT NULL,
    permiso VARCHAR(255) NOT NULL,
    CONSTRAINT fk_rol_permisos_rol FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Seed basic permisos for each rol
INSERT INTO rol_permisos (rol_id, permiso) VALUES
-- ADMIN (rol_id = 1) - all permissions
(1, 'TEMPO_READ'), (1, 'TEMPO_WRITE'), (1, 'TEMPO_ADMIN'),
(1, 'TOPS_READ'), (1, 'TOPS_WRITE'), (1, 'TOPS_ADMIN'),
(1, 'ADMIN_READ'), (1, 'ADMIN_WRITE'),
-- GESTOR (rol_id = 2)
(2, 'TEMPO_READ'), (2, 'TEMPO_WRITE'),
(2, 'TOPS_READ'), (2, 'TOPS_WRITE'),
-- OPERADOR (rol_id = 3)
(3, 'TEMPO_READ'), (3, 'TEMPO_WRITE'),
(3, 'TOPS_READ'),
-- VISUALIZADOR (rol_id = 4)
(4, 'TEMPO_READ'), (4, 'TOPS_READ');
