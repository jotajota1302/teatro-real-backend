-- ===============================================
-- V10: Actualizar espacios para coincidir con vista de calendario
-- ===============================================

-- Renombrar "Sala Principal" a "Escenario"
UPDATE espacios SET nombre = 'Escenario', orden = 1 WHERE id = 1;

-- Actualizar "Sala Gayarre" para orden correcto
UPDATE espacios SET orden = 2 WHERE nombre = 'Sala Gayarre';

-- Añadir S.E.P.E (Sala de Ensayos del Personal del Escenario)
INSERT INTO espacios (nombre, tipo, capacidad, ubicacion, activo, orden, color) VALUES
    ('S.E.P.E', 'SALA', 40, 'Edificio Principal - Planta 0', TRUE, 3, '#0D9488');

-- Actualizar orden de Sala de Ensayo Ballet
UPDATE espacios SET orden = 4 WHERE nombre = 'Sala de Ensayo Ballet';

-- Unificar Sala de Ensayo Orquesta y Coro bajo un nuevo nombre y orden
UPDATE espacios SET nombre = 'Sala Orquesta/Coro', orden = 5 WHERE id = 2;

-- Marcar Sala de Ensayo Coro como parte del grupo orquesta (mantener pero con orden alto)
UPDATE espacios SET orden = 50 WHERE id = 3;

-- Añadir "Otras Salas" como categoría genérica
INSERT INTO espacios (nombre, tipo, capacidad, ubicacion, activo, orden, color) VALUES
    ('Otras Salas', 'SALA', 100, 'Varias ubicaciones', TRUE, 6, '#6B7280');
