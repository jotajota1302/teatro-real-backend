-- MIGRACIÓN V3: Datos semilla para espacios y tipos de actividad

INSERT INTO tipos_actividad (nombre, color_hex) VALUES
('Función', '#0000FF'),
('Ensayo', '#008000'),
('Montaje', '#FA8072'),
('Evento', '#FF1493');

INSERT INTO espacios (nombre, tipo, color, capacidad, ubicacion, activo, orden)
VALUES
('Sala Principal', 'SALA', '#1a1a2e', 1724, 'Planta 0', true, 1),
('Sala Gayarre', 'SALA', '#e94560', 400, 'Planta 1', true, 2),
('Almacén A', 'ALMACEN', '#c9a227', 100, 'Subsuelo', true, 3),
('Almacén B', 'ALMACEN', '#16213e', 80, 'Subsuelo', true, 4);
