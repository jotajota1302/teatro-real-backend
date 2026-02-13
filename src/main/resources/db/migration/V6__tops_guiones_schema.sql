-- =====================================================
-- V6: Esquema TOPS - Guiones Técnicos
-- Según TR-Requisitos v1.3
-- =====================================================

-- Tabla de guiones (documento principal)
CREATE TABLE IF NOT EXISTS guiones (
    id VARCHAR(36) PRIMARY KEY,
    temporada VARCHAR(20) NOT NULL,
    produccion_nombre VARCHAR(255) NOT NULL,
    compania VARCHAR(255),
    productor VARCHAR(255),
    responsable_edicion VARCHAR(255),
    director_escena VARCHAR(255),
    director_musical VARCHAR(255),
    subtitulo VARCHAR(255),
    compositor VARCHAR(255),
    version INTEGER DEFAULT 1,
    version_nombre VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'BORRADOR',
    locked_by VARCHAR(36),
    locked_at TIMESTAMP,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_guion_locked_by FOREIGN KEY (locked_by) REFERENCES usuarios(id),
    CONSTRAINT fk_guion_created_by FOREIGN KEY (created_by) REFERENCES usuarios(id)
);

-- Tabla de actos (subdivisión del guion)
CREATE TABLE IF NOT EXISTS actos (
    id VARCHAR(36) PRIMARY KEY,
    guion_id VARCHAR(36) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_acto_guion FOREIGN KEY (guion_id) REFERENCES guiones(id) ON DELETE CASCADE
);

-- Tabla de pasada_items (setup inicial de cada acto)
CREATE TABLE IF NOT EXISTS pasada_items (
    id VARCHAR(36) PRIMARY KEY,
    acto_id VARCHAR(36) NOT NULL,
    departamento VARCHAR(20),
    lugar VARCHAR(100),
    descripcion TEXT,
    imagen VARCHAR(500),
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pasada_acto FOREIGN KEY (acto_id) REFERENCES actos(id) ON DELETE CASCADE
);

-- Tabla de escenas (subdivisión de actos)
CREATE TABLE IF NOT EXISTS escenas (
    id VARCHAR(36) PRIMARY KEY,
    acto_id VARCHAR(36) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    duracion VARCHAR(20),
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_escena_acto FOREIGN KEY (acto_id) REFERENCES actos(id) ON DELETE CASCADE
);

-- Tabla de elementos del guion (TOPs, Entradas, Mutis, etc.)
CREATE TABLE IF NOT EXISTS elementos_guion (
    id VARCHAR(36) PRIMARY KEY,
    escena_id VARCHAR(36) NOT NULL,
    tipo_elemento VARCHAR(20) NOT NULL,
    numero VARCHAR(20),
    ref_pagina VARCHAR(50),
    ref_compas VARCHAR(50),
    ref_timecode VARCHAR(50),
    departamento VARCHAR(100),
    descripcion TEXT,
    observaciones TEXT,
    imagen VARCHAR(500),
    color_hex VARCHAR(7),
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_elemento_escena FOREIGN KEY (escena_id) REFERENCES escenas(id) ON DELETE CASCADE
);

-- Tabla de colores por tipo de elemento (configuración)
CREATE TABLE IF NOT EXISTS colores_elemento_guion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo_elemento VARCHAR(20) UNIQUE NOT NULL,
    color_hex VARCHAR(7) NOT NULL,
    descripcion VARCHAR(100)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_guiones_temporada ON guiones(temporada);
CREATE INDEX IF NOT EXISTS idx_guiones_estado ON guiones(estado);
CREATE INDEX IF NOT EXISTS idx_actos_guion ON actos(guion_id);
CREATE INDEX IF NOT EXISTS idx_actos_orden ON actos(guion_id, orden);
CREATE INDEX IF NOT EXISTS idx_pasada_acto ON pasada_items(acto_id);
CREATE INDEX IF NOT EXISTS idx_escenas_acto ON escenas(acto_id);
CREATE INDEX IF NOT EXISTS idx_escenas_orden ON escenas(acto_id, orden);
CREATE INDEX IF NOT EXISTS idx_elementos_escena ON elementos_guion(escena_id);
CREATE INDEX IF NOT EXISTS idx_elementos_tipo ON elementos_guion(tipo_elemento);

-- Datos iniciales: Colores por defecto para tipos de elemento
INSERT INTO colores_elemento_guion (tipo_elemento, color_hex, descripcion) VALUES
('TOP', '#B71C1C', 'Rojo oscuro - Orden técnica sincronizada'),
('ENTRADA', '#1B5E20', 'Verde oscuro - Entrada de personaje'),
('MUTIS', '#4A148C', 'Púrpura - Salida de personaje'),
('INTERNO', '#E65100', 'Naranja - Movimiento interno'),
('AVISO', '#0D47A1', 'Azul - Aviso previo'),
('PASADA_ITEM', '#37474F', 'Gris - Item de pasada');

-- Nota: Los departamentos TOPS ya existen en la tabla departamentos
-- o se pueden añadir manualmente desde la sección de administración
