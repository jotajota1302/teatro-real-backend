-- ==============================
-- V1: Creación de schema básico
-- ==============================
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(32) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    -- Set de permisos como texto separado por comas para simular SET en SQL plano
    permisos TEXT
);

CREATE TABLE departamentos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    jefe_id VARCHAR(36),
    ambito VARCHAR(100),
    color_hex VARCHAR(20)
);

CREATE TABLE usuarios (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    avatar_url VARCHAR(255),
    rol_id INTEGER NOT NULL REFERENCES roles(id),
    departamento_id INTEGER REFERENCES departamentos(id),
    activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE departamentos
    ADD CONSTRAINT fk_departamento_jefe FOREIGN KEY (jefe_id) REFERENCES usuarios(id);

CREATE TABLE departamento_usuarios (
    departamento_id INTEGER NOT NULL REFERENCES departamentos(id),
    usuario_id VARCHAR(36) NOT NULL REFERENCES usuarios(id),
    PRIMARY KEY (departamento_id, usuario_id)
);

CREATE TABLE temporadas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activa BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permisos_modulo (
    id SERIAL PRIMARY KEY,
    usuario_id VARCHAR(36) NOT NULL REFERENCES usuarios(id),
    modulo VARCHAR(20) NOT NULL,
    nivel_acceso VARCHAR(20) NOT NULL,
    UNIQUE(usuario_id, modulo)
);

-- Índices adicionales
CREATE INDEX idx_usuario_rol ON usuarios(rol_id);
CREATE INDEX idx_usuario_departamento ON usuarios(departamento_id);
CREATE INDEX idx_permiso_modulo_usuario ON permisos_modulo(usuario_id);
