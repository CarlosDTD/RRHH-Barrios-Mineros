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

CREATE TABLE cat_unidades_servicios (
    id SERIAL PRIMARY KEY,
    nombre_unidad VARCHAR(150) NOT NULL UNIQUE
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
    biometrico_id VARCHAR(50) UNIQUE
);

CREATE TABLE vinculos_laborales (
    id SERIAL PRIMARY KEY,
    personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
    establecimiento_id INT REFERENCES establecimientos(id),
    tipo_personal_id INT REFERENCES cat_tipos_personal(id),
    fuente_financiamiento_id INT REFERENCES cat_fuentes_financiamiento(id),
    unidad_servicio_id INT REFERENCES cat_unidades_servicios(id),
    unidad_servicio VARCHAR(150),
    cargo_actual VARCHAR(150),
    cargo_planilla VARCHAR(150),
    cargo_escala VARCHAR(150),
    nro_resumen_ejecutivo VARCHAR(100),
    carga_horaria VARCHAR(10),
    fecha_ingreso DATE,
    fecha_fin_contrato DATE,
    fecha_institucionalizacion DATE,
    observaciones TEXT
);

-- Tablas de Asistencia
CREATE TABLE asistencia_mensual (
    id SERIAL PRIMARY KEY,
    personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
    mes INT NOT NULL,
    anio INT NOT NULL,
    total_horas NUMERIC(10, 2) DEFAULT 0,
    total_atrasos_min INT DEFAULT 0,
    observaciones TEXT DEFAULT '',
    tipo_planilla VARCHAR(50),
    UNIQUE(personal_id, mes, anio, tipo_planilla)
);

CREATE TABLE asistencia_diaria (
    id SERIAL PRIMARY KEY,
    asistencia_id INT REFERENCES asistencia_mensual(id) ON DELETE CASCADE,
    dia INT NOT NULL,
    valor VARCHAR(10)
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

-- Unidades y Servicios del Hospital
INSERT INTO cat_unidades_servicios (nombre_unidad) VALUES
('SERVICIO DE AMBULANCIA'),
('SERVICIO DE ANESTESIOLOGIA'),
('SERVICIO DE ATENCION TEMPRANA'),
('SERVICIO DE CIRUGIA GENERAL'),
('SERVICIO DE COCINA'),
('SERVICIO DE EMERGENCIAS'),
('SERVICIO DE ESTADISTICA'),
('SERVICIO DE FISIOTERAPIA'),
('SERVICIO DE GINECOLOGIA'),
('SERVICIO DE LAVANDERIA'),
('SERVICIO DE LIMPIEZA'),
('SERVICIO DE MATERNIDAD'),
('SERVICIO DE MEDICINA INTERNA'),
('SERVICIO DE NEONATOLOGIA'),
('SERVICIO DE NUTRICION'),
('SERVICIO DE PEDIATRIA'),
('SERVICIO DE PLANCHADO'),
('SERVICIO DE PORTERIA'),
('SERVICIO DE QUIROFANO Y CENTRAL DE ESTERILIZACION'),
('SERVICIO DE SISTEMAS'),
('SERVICIO DE TERAPIA INTERMEDIA'),
('SERVICIO DE TRAUMATOLOGIA'),
('SERVICIO UNIDAD DE HEMODIALISIS'),
('AUXILIAR DE OFICINA');

-- Tablas de Biometría
CREATE TABLE biometrico_config (
    id SERIAL PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    port INT DEFAULT 4370,
    comms_key INT DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'DESCONECTADO',
    ultimo_sync_usuarios TIMESTAMP,
    ultimo_sync_logs TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE biometrico_logs_raw (
    id SERIAL PRIMARY KEY,
    biometrico_id VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    verificacion_tipo INT DEFAULT 0,
    estado_asistencia INT DEFAULT 0,
    device_ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(biometrico_id, timestamp)
);
