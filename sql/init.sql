-- Crear base de datos (Ejecutar manualmente si no existe)
-- CREATE DATABASE rrhh_barrios_mineros;

-- Tablas de Catálogo
CREATE TABLE cat_expediciones (
    id SERIAL PRIMARY KEY,
    sigla VARCHAR(5) NOT NULL,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE cat_profesiones (
    id SERIAL PRIMARY KEY,
    nombre_profesion VARCHAR(100) NOT NULL
);

CREATE TABLE cat_tipos_personal (
    id SERIAL PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL
);

CREATE TABLE cat_fuentes_financiamiento (
    id SERIAL PRIMARY KEY,
    nombre_fuente VARCHAR(100) NOT NULL
);

-- Tablas Principales
CREATE TABLE establecimientos (
    id SERIAL PRIMARY KEY,
    nombre_establecimiento VARCHAR(150) NOT NULL,
    municipio VARCHAR(100) DEFAULT 'Oruro',
    red VARCHAR(100) DEFAULT 'Red Urbana'
);

CREATE TABLE personal (
    id SERIAL PRIMARY KEY,
    ci VARCHAR(20) NOT NULL UNIQUE,
    complemento VARCHAR(5),
    exp_id INT REFERENCES cat_expediciones(id),
    apellido_paterno VARCHAR(100),
    apellido_materno VARCHAR(100),
    apellido_casada VARCHAR(100),
    primer_nombre VARCHAR(100) NOT NULL,
    segundo_nombre VARCHAR(100),
    tercer_nombre VARCHAR(100),
    fecha_nacimiento DATE,
    profesion_id INT REFERENCES cat_profesiones(id),
    telefono VARCHAR(20)
);

CREATE TABLE vinculos_laborales (
    id SERIAL PRIMARY KEY,
    personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
    establecimiento_id INT REFERENCES establecimientos(id),
    tipo_personal_id INT REFERENCES cat_tipos_personal(id),
    fuente_financiamiento_id INT REFERENCES cat_fuentes_financiamiento(id),
    identificador_laboral VARCHAR(100),
    unidad_servicio VARCHAR(150),
    cargo_actual VARCHAR(150),
    carga_horaria VARCHAR(10),
    fecha_ingreso DATE,
    fecha_institucionalizacion DATE,
    observaciones TEXT
);

-- Datos iniciales sugeridos
INSERT INTO cat_expediciones (sigla, nombre) VALUES 
('LP', 'La Paz'), ('OR', 'Oruro'), ('CB', 'Cochabamba'), 
('SC', 'Santa Cruz'), ('BN', 'Beni'), ('PA', 'Pando'), 
('TJ', 'Tarija'), ('PT', 'Potosí'), ('CH', 'Chuquisaca');

INSERT INTO establecimientos (nombre_establecimiento) VALUES ('HBM - Hospital Barrios Mineros');
