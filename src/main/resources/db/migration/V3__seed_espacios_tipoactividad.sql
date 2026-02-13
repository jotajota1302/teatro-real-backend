-- ===============================================
-- V3: Crear tablas TEMPO y datos semilla
-- ===============================================

-- Tabla de espacios (salas, almacenes, etc.)
CREATE TABLE IF NOT EXISTS espacios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    google_calendar_id VARCHAR(255),
    color VARCHAR(20),
    capacidad INTEGER,
    dimensiones VARCHAR(100),
    ubicacion VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    orden INTEGER
);

-- Tabla de tipos de actividad
CREATE TABLE IF NOT EXISTS tipos_actividad (
    id VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    color_hex VARCHAR(7) NOT NULL,
    descripcion VARCHAR(250),
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de actividades
CREATE TABLE IF NOT EXISTS actividades (
    id VARCHAR(36) PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    temporada_id BIGINT NOT NULL,
    descripcion CLOB,
    tipo_actividad_id VARCHAR(36) NOT NULL,
    espacio_id BIGINT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    departamento_id BIGINT,
    notas CLOB,
    tipo_movimiento VARCHAR(20),
    num_camiones INTEGER,
    lugar_origen VARCHAR(255),
    lugar_destino VARCHAR(255),
    produccion_nombre VARCHAR(255),
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    google_event_id VARCHAR(255),
    ultima_sincronizacion TIMESTAMP,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (temporada_id) REFERENCES temporadas(id),
    FOREIGN KEY (tipo_actividad_id) REFERENCES tipos_actividad(id),
    FOREIGN KEY (espacio_id) REFERENCES espacios(id),
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id),
    FOREIGN KEY (created_by) REFERENCES usuarios(id)
);

-- Tabla de documentos de actividad
CREATE TABLE IF NOT EXISTS actividad_documento (
    id VARCHAR(36) PRIMARY KEY,
    actividad_id VARCHAR(36) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    origen VARCHAR(10) NOT NULL,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actividad_id) REFERENCES actividades(id)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_actividades_fecha ON actividades(fecha);
CREATE INDEX IF NOT EXISTS idx_actividades_temporada ON actividades(temporada_id);
CREATE INDEX IF NOT EXISTS idx_actividades_espacio ON actividades(espacio_id);
CREATE INDEX IF NOT EXISTS idx_actividades_tipo ON actividades(tipo_actividad_id);

-- ===============================================
-- Datos semilla: Espacios del Teatro Real
-- ===============================================
INSERT INTO espacios (nombre, tipo, capacidad, ubicacion, activo, orden, color) VALUES
    ('Sala Principal', 'SALA', 1750, 'Edificio Principal - Planta 1', TRUE, 1, '#1E40AF'),
    ('Sala de Ensayo Orquesta', 'SALA', 120, 'Edificio Anexo - Planta 2', TRUE, 2, '#059669'),
    ('Sala de Ensayo Coro', 'SALA', 80, 'Edificio Anexo - Planta 3', TRUE, 3, '#7C3AED'),
    ('Sala de Ensayo Ballet', 'SALA', 60, 'Edificio Anexo - Planta 1', TRUE, 4, '#DB2777'),
    ('Sala Gayarre', 'SALA', 150, 'Edificio Principal - Planta 0', TRUE, 5, '#EA580C'),
    ('Almacen Escenografia', 'ALMACEN', 500, 'Nave Industrial - Arganda', TRUE, 10, '#64748B'),
    ('Almacen Vestuario', 'ALMACEN', 200, 'Edificio Principal - Sotano -1', TRUE, 11, '#78716C'),
    ('Almacen Atrezzo', 'ALMACEN', 150, 'Edificio Principal - Sotano -2', TRUE, 12, '#71717A'),
    ('Almacen Iluminacion', 'ALMACEN', 100, 'Edificio Principal - Sotano -1', TRUE, 13, '#FCD34D'),
    ('Taller de Escenografia', 'TALLER', 300, 'Nave Industrial - Arganda', TRUE, 20, '#F97316'),
    ('Taller de Vestuario', 'TALLER', 80, 'Edificio Principal - Planta 4', TRUE, 21, '#EC4899'),
    ('Camerino Principal', 'CAMERINO', 4, 'Edificio Principal - Planta 1', TRUE, 30, '#8B5CF6'),
    ('Camerinos Solistas', 'CAMERINO', 20, 'Edificio Principal - Planta 1', TRUE, 31, '#A78BFA');

-- ===============================================
-- Datos semilla: Tipos de Actividad
-- ===============================================
INSERT INTO tipos_actividad (id, nombre, color_hex, descripcion, activo) VALUES
    ('ta-funcion-001', 'Funcion', '#DC2626', 'Funcion abierta al publico', TRUE),
    ('ta-ensayo-general-002', 'Ensayo General', '#2563EB', 'Ensayo general con vestuario y escenografia completa', TRUE),
    ('ta-ensayo-italiano-003', 'Ensayo Italiano', '#16A34A', 'Ensayo musical sin movimiento escenico', TRUE),
    ('ta-ensayo-piano-004', 'Ensayo con Piano', '#8B5CF6', 'Ensayo de solistas con acompanamiento de piano', TRUE),
    ('ta-ensayo-orquesta-005', 'Ensayo de Orquesta', '#0891B2', 'Ensayo exclusivo de orquesta', TRUE),
    ('ta-ensayo-coro-006', 'Ensayo de Coro', '#7C3AED', 'Ensayo exclusivo de coro', TRUE),
    ('ta-ensayo-ballet-007', 'Ensayo de Ballet', '#DB2777', 'Ensayo de cuerpo de baile', TRUE),
    ('ta-montaje-008', 'Montaje', '#EA580C', 'Montaje de escenografia e iluminacion', TRUE),
    ('ta-desmontaje-009', 'Desmontaje', '#F97316', 'Desmontaje de produccion', TRUE),
    ('ta-prueba-luces-010', 'Prueba de Luces', '#FBBF24', 'Ajuste y prueba de iluminacion', TRUE),
    ('ta-prueba-sonido-011', 'Prueba de Sonido', '#A3E635', 'Ajuste y prueba de sonido', TRUE),
    ('ta-evento-012', 'Evento Especial', '#F472B6', 'Evento corporativo o especial', TRUE),
    ('ta-visita-013', 'Visita Guiada', '#6366F1', 'Visita guiada al teatro', TRUE),
    ('ta-grabacion-014', 'Grabacion', '#EF4444', 'Grabacion de audio/video', TRUE),
    ('ta-mantenimiento-015', 'Mantenimiento', '#6B7280', 'Trabajos de mantenimiento tecnico', TRUE);

-- ===============================================
-- Datos semilla: Departamentos del Teatro
-- ===============================================
MERGE INTO departamentos (id, codigo, nombre, descripcion, ambito, color_hex) KEY(codigo) VALUES
    (1, 'DIR', 'Direccion Artistica', 'Direccion artistica y programacion', 'ARTISTICO', '#DC2626'),
    (2, 'ORQ', 'Orquesta', 'Orquesta Titular del Teatro Real', 'ARTISTICO', '#2563EB'),
    (3, 'CORO', 'Coro', 'Coro Titular del Teatro Real', 'ARTISTICO', '#7C3AED'),
    (4, 'BALLET', 'Ballet', 'Compania Nacional de Danza', 'ARTISTICO', '#DB2777'),
    (5, 'ESC', 'Escenografia', 'Diseno y construccion escenografica', 'TECNICO', '#EA580C'),
    (6, 'VEST', 'Vestuario', 'Diseno y confeccion de vestuario', 'TECNICO', '#EC4899'),
    (7, 'ILUM', 'Iluminacion', 'Diseno y operacion de iluminacion', 'TECNICO', '#FBBF24'),
    (8, 'SON', 'Sonido', 'Diseno y operacion de sonido', 'TECNICO', '#A3E635'),
    (9, 'UTIL', 'Utileria', 'Atrezzo y mobiliario escenico', 'TECNICO', '#F97316'),
    (10, 'MAQUI', 'Maquinaria', 'Maquinaria escenica', 'TECNICO', '#0891B2'),
    (11, 'PROD', 'Produccion', 'Coordinacion de produccion', 'GESTION', '#6366F1'),
    (12, 'RRHH', 'Recursos Humanos', 'Gestion de personal', 'GESTION', '#64748B'),
    (13, 'LOG', 'Logistica', 'Logistica y transporte', 'GESTION', '#78716C'),
    (14, 'COM', 'Comunicacion', 'Comunicacion y prensa', 'GESTION', '#8B5CF6'),
    (15, 'ADMIN', 'Administracion', 'Administracion general', 'GESTION', '#71717A');

-- ===============================================
-- Datos semilla: Usuario administrador por defecto
-- ===============================================
MERGE INTO usuarios (id, email, nombre, rol_id, activo) KEY(email) VALUES
    ('admin-001-uuid', 'admin@teatroreal.es', 'Administrador Sistema', 1, TRUE);

-- Permisos de modulo para el admin
MERGE INTO permisos_modulo (id, usuario_id, modulo, nivel_acceso) KEY(usuario_id, modulo) VALUES
    (1, 'admin-001-uuid', 'TEMPO', 'ADMIN'),
    (2, 'admin-001-uuid', 'TOPS', 'ADMIN'),
    (3, 'admin-001-uuid', 'LOGISTICA', 'ADMIN');
