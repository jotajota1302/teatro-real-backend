-- Migración V3: Datos semilla para Espacio y TipoActividad (TEMPO)
-- Espacios (salas y almacenes)
INSERT INTO espacio (id, nombre, tipo, capacidad, ubicacion, activo, orden)
VALUES
  ('a1be98be-ecf1-42c2-b2c0-esp-sala-1', 'Sala Principal', 'SALA', 1750, 'Planta 1', TRUE, 1),
  ('a1be98be-ecf1-42c2-b2c0-esp-ensayo', 'Sala de Ensayo', 'SALA', 150, 'Edificio Anexo', TRUE, 2),
  ('a1be98be-ecf1-42c2-b2c0-esp-almacen-1', 'Almacén Escenografía', 'ALMACEN', 80, 'Sótano -1', TRUE, 3),
  ('a1be98be-ecf1-42c2-b2c0-esp-almacen-2', 'Almacén Vestuario', 'ALMACEN', 40, 'Planta 2', TRUE, 4);

-- Tipos de Actividad
INSERT INTO tipo_actividad (id, nombre, color_hex, descripcion)
VALUES
  ('tcaf9050-11e7-4d3b-ta-funcion', 'Función', '#0000FF', 'Actividad de función principal'),
  ('tcaf9050-11e7-4d3b-ta-ensayo', 'Ensayo', '#008000', 'Actividad de ensayo de compañía'),
  ('tcaf9050-11e7-4d3b-ta-montaje', 'Montaje', '#FA8072', 'Montaje técnico'),
  ('tcaf9050-11e7-4d3b-ta-evento', 'Evento', '#FF1493', 'Otro evento especial');
