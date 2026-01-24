-- ===============================================
-- V5: Agregar almacenes y tipos actividad v1.3
-- ===============================================

-- ===============================================
-- Almacenes según v1.3: Arganda-Campa, Arganda-Nave
-- ===============================================
INSERT INTO espacios (nombre, tipo, ubicacion, activo, orden, color) VALUES
    ('Arganda-Campa', 'ALMACEN', 'Nave Logística Arganda del Rey - Zona Campa', TRUE, 14, '#34D399'),
    ('Arganda-Nave', 'ALMACEN', 'Nave Logística Arganda del Rey - Nave Principal', TRUE, 15, '#F87171');

-- ===============================================
-- Tipos de actividad específicos para Logística (v1.3)
-- Verde: Recogida de producciones
-- Rosa: Salida de producciones
-- ===============================================
INSERT INTO tipos_actividad (id, nombre, color_hex, descripcion, activo) VALUES
    ('ta-recogida-log-016', 'Recogida de Produccion', '#34D399', 'Recogida de material de producción hacia almacén', TRUE),
    ('ta-salida-log-017', 'Salida de Produccion', '#F87171', 'Salida de material de producción desde almacén', TRUE),
    ('ta-transporte-int-018', 'Transporte Interno', '#FBBF24', 'Transporte interno entre almacenes o espacios', TRUE);

-- ===============================================
-- Datos ejemplo de operaciones logísticas
-- ===============================================
INSERT INTO actividades (
    id, titulo, temporada_id, descripcion, tipo_actividad_id, espacio_id,
    fecha, hora_inicio, hora_fin, departamento_id, estado,
    tipo_movimiento, num_camiones, lugar_origen, lugar_destino, produccion_nombre
) VALUES
    (
        'log-001-ejemplo',
        'Carmen - Salida Internacional',
        1,
        'Salida de escenografía completa hacia Royal Opera House Londres',
        'ta-salida-log-017',
        (SELECT id FROM espacios WHERE nombre = 'Arganda-Campa'),
        '2026-01-30',
        '08:00',
        '14:00',
        13, -- Logística
        'PENDIENTE',
        'SALIDA',
        15,
        'Arganda-Campa',
        'Londres - Royal Opera House',
        'Carmen'
    ),
    (
        'log-002-ejemplo',
        'Tosca - Recogida Coproducción',
        1,
        'Recogida de material de coproducción desde Liceu Barcelona',
        'ta-recogida-log-016',
        (SELECT id FROM espacios WHERE nombre = 'Arganda-Nave'),
        '2026-01-25',
        '22:00',
        '06:00',
        13, -- Logística
        'COMPLETADO',
        'ENTRADA',
        5,
        'Gran Teatre del Liceu Barcelona',
        'Arganda-Nave',
        'Tosca'
    ),
    (
        'log-003-ejemplo',
        'La Traviata - Traslado Interno',
        1,
        'Traslado de vestuario y utilería para montaje',
        'ta-transporte-int-018',
        (SELECT id FROM espacios WHERE nombre = 'Arganda-Campa'),
        '2026-01-28',
        '07:00',
        '12:00',
        13, -- Logística
        'EN_TRANSITO',
        'INTERNO',
        3,
        'Arganda-Nave',
        'Teatro Real - Escenario Principal',
        'La Traviata'
    );
