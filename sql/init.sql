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
    telefono VARCHAR(20),
    biometrico_id INTEGER
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
    cargo_planilla VARCHAR(150),
    cargo_escala VARCHAR(150),
    nro_resumen_ejecutivo VARCHAR(100),
    carga_horaria VARCHAR(10),
    fecha_ingreso DATE,
    fecha_institucionalizacion DATE,
    observaciones TEXT
);

INSERT INTO cat_fuentes_financiamiento (nombre_fuente) VALUES 
('TGN'), ('HIPC'), ('MINISTERIO'), ('MUNICIPIO');

INSERT INTO cat_tipos_personal (nombre_tipo) VALUES 
('ÍTEM'), ('CONTRATO'), ('CONSULTORÍA');

-- Datos iniciales sugeridos
INSERT INTO cat_expediciones (sigla, nombre) VALUES 
('LP', 'La Paz'), ('OR', 'Oruro'), ('CB', 'Cochabamba'), 
('SC', 'Santa Cruz'), ('BN', 'Beni'), ('PA', 'Pando'), 
('TJ', 'Tarija'), ('PT', 'Potosí'), ('CH', 'Chuquisaca');

INSERT INTO establecimientos (nombre_establecimiento) VALUES ('HBM - Hospital Barrios Mineros');

CREATE TABLE asistencia_mensual (
    id SERIAL PRIMARY KEY,
    personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
    mes INT NOT NULL,
    anio INT NOT NULL,
    total_horas NUMERIC(10,2) DEFAULT 0,
    total_atrasos_min INT DEFAULT 0,
    observaciones TEXT,
    tipo_planilla VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(personal_id, mes, anio, tipo_planilla)
);

CREATE TABLE asistencia_diaria (
    id SERIAL PRIMARY KEY,
    asistencia_id INT REFERENCES asistencia_mensual(id) ON DELETE CASCADE,
    dia INT NOT NULL,
    valor VARCHAR(10)
);

CREATE TABLE asistencia_rotaciones (
    id SERIAL PRIMARY KEY,
    personal_id INT REFERENCES personal(id),
    fecha_inicio DATE,
    fecha_fin DATE,
    rotacion_de VARCHAR(150),
    rotacion_a VARCHAR(150),
    tiempo_rotacion VARCHAR(50),
    observaciones TEXT
);

CREATE TABLE biometrico_config (
    id INTEGER PRIMARY KEY,
    ip_address VARCHAR(50),
    port INTEGER,
    comms_key VARCHAR(50),
    ultimo_sync_usuarios TIMESTAMP,
    ultimo_sync_logs TIMESTAMP,
    estado VARCHAR(20)
);

CREATE TABLE biometrico_logs_raw (
    id SERIAL PRIMARY KEY,
    biometrico_id INTEGER,
    timestamp TIMESTAMP,
    verificacion_tipo INTEGER,
    estado_asistencia INTEGER,
    device_ip VARCHAR(50),
    UNIQUE(biometrico_id, timestamp)
);

CREATE TABLE historial_movimientos (
    id SERIAL PRIMARY KEY,
    personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
    tipo_movimiento VARCHAR(100),
    detalles_anteriores JSONB,
    detalles_nuevos JSONB,
    motivo TEXT,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
