-- Seed de espacios (salas y almacenes)
INSERT INTO espacios (nombre, tipo, color, capacidad, dimensiones, ubicacion, activo, orden)
VALUES 
  ('Sala Principal',    'SALA',   '#8811BB', 1700,  '35x28', 'Calle A', TRUE, 1),
  ('Sala Gayarre',      'SALA',   '#2288DD', 500,   '18x12', 'Calle B', TRUE, 2),
  ('Almacen Central',   'ALMACEN','#33CC77', 0,     null,    'Nave S1', TRUE, 10),
  ('Almacen Norte',     'ALMACEN','#CCCC44', 0,     null,    'Nave N2', TRUE, 11);

-- Seed de tipos de actividad
INSERT INTO tipos_actividad (nombre, color, activo, descripcion)
VALUES 
  ('Ensayo',     '#1E90FF', TRUE,  'Ensayo general o de sección'),
  ('Función',    '#CC2222', TRUE,  'Representación frente a público'),
  ('Carga',      '#444488', TRUE,  'Movimiento de cargas (almacén)'),
  ('Descarga',   '#884444', TRUE,  'Movimiento de descargas (almacén)');
