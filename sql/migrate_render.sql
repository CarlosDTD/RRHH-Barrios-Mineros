-- Migración: alinear schema con cambios de Carlos
-- Ejecutar contra Render PostgreSQL

BEGIN;

-- 1. cat_unidades_servicios: crear tabla + insertar unidades del hospital
CREATE TABLE IF NOT EXISTS cat_unidades_servicios (
    id SERIAL PRIMARY KEY,
    nombre_unidad VARCHAR(150) NOT NULL UNIQUE
);

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
('AUXILIAR DE OFICINA')
ON CONFLICT (nombre_unidad) DO NOTHING;

-- 2. personal: agregar columnas faltantes
ALTER TABLE personal ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'ACTIVO';
ALTER TABLE personal ADD COLUMN IF NOT EXISTS fecha_baja DATE;

-- Cambiar biometrico_id de INTEGER a VARCHAR(50) y agregar UNIQUE
ALTER TABLE personal ALTER COLUMN biometrico_id TYPE VARCHAR(50) USING biometrico_id::VARCHAR(50);
DROP INDEX IF EXISTS personal_biometrico_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS personal_biometrico_id_key ON personal (biometrico_id) WHERE biometrico_id IS NOT NULL;

-- 3. vinculos_laborales: agregar columnas faltantes
ALTER TABLE vinculos_laborales ADD COLUMN IF NOT EXISTS unidad_servicio_id INT REFERENCES cat_unidades_servicios(id);
ALTER TABLE vinculos_laborales ADD COLUMN IF NOT EXISTS fecha_fin_contrato DATE;

-- 4. biometrico_config: agregar columnas faltantes
ALTER TABLE biometrico_config ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE biometrico_config ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE biometrico_config ALTER COLUMN comms_key TYPE INT USING comms_key::INTEGER;
ALTER TABLE biometrico_config ALTER COLUMN comms_key SET DEFAULT 0;
ALTER TABLE biometrico_config ALTER COLUMN estado SET DEFAULT 'DESCONECTADO';

-- 5. biometrico_logs_raw: cambiar biometrico_id a VARCHAR(50) y agregar created_at
ALTER TABLE biometrico_logs_raw ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE biometrico_logs_raw ALTER COLUMN biometrico_id TYPE VARCHAR(50) USING biometrico_id::VARCHAR(50);
ALTER TABLE biometrico_logs_raw ALTER COLUMN biometrico_id SET NOT NULL;

-- 6. Módulo de Correspondencia + Autenticación (Carlos)
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permisos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(255),
    modulo VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rol_permisos (
    rol_id INT REFERENCES roles(id) ON DELETE CASCADE,
    permiso_id INT REFERENCES permisos(id) ON DELETE CASCADE,
    PRIMARY KEY (rol_id, permiso_id)
);

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    personal_id INT REFERENCES personal(id) ON DELETE SET NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    password_cambiado BOOLEAN DEFAULT false,
    google_id VARCHAR(100),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuario_roles (
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    rol_id INT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, rol_id)
);

CREATE TABLE IF NOT EXISTS cat_tipos_correspondencia (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS cat_clasificaciones (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS cat_etiquetas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#3b82f6'
);

CREATE TABLE IF NOT EXISTS secuencia_hr (
    gestion INT PRIMARY KEY,
    ultimo_numero INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS configuracion_cite (
    id INTEGER PRIMARY KEY DEFAULT 1,
    hospital_sigla VARCHAR(10) NOT NULL DEFAULT 'HBM',
    separador VARCHAR(5) NOT NULL DEFAULT '/',
    formato TEXT NOT NULL DEFAULT '{SIGLA}/{AREA}/{TIPO}/N° {NRO}/{GESTION}',
    gestion_actual INT NOT NULL DEFAULT 2026,
    ultimo_numero INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unica_fila CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS correspondencia (
    id SERIAL PRIMARY KEY,
    hr_correlativo INT NOT NULL,
    gestion INT NOT NULL DEFAULT 2026,
    cite VARCHAR(150),
    tipo_id INT REFERENCES cat_tipos_correspondencia(id),
    clasificacion_id INT REFERENCES cat_clasificaciones(id),
    remitente_externo VARCHAR(255),
    remitente_interno_id INT REFERENCES usuarios(id),
    destinatario_original VARCHAR(255),
    referencia TEXT NOT NULL,
    pdf_original VARCHAR(500),
    pdf_comprimido VARCHAR(500),
    folios INT,
    fecha_documento DATE NOT NULL,
    fecha_recepcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_recepcion_id INT REFERENCES usuarios(id),
    estado VARCHAR(20) DEFAULT 'recibido',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(hr_correlativo, gestion)
);

CREATE TABLE IF NOT EXISTS correspondencia_etiquetas (
    correspondencia_id INT REFERENCES correspondencia(id) ON DELETE CASCADE,
    etiqueta_id INT REFERENCES cat_etiquetas(id) ON DELETE CASCADE,
    PRIMARY KEY (correspondencia_id, etiqueta_id)
);

CREATE TABLE IF NOT EXISTS derivaciones (
    id SERIAL PRIMARY KEY,
    correspondencia_id INT REFERENCES correspondencia(id) ON DELETE CASCADE,
    de_usuario_id INT REFERENCES usuarios(id),
    para_usuario_id INT REFERENCES usuarios(id),
    instruccion TEXT,
    accion VARCHAR(50) DEFAULT 'derivar',
    respuesta TEXT,
    documento_respuesta_pdf VARCHAR(500),
    fecha_derivacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP,
    completada BOOLEAN DEFAULT false,
    orden INT DEFAULT 1
);

CREATE OR REPLACE FUNCTION next_hr(p_gestion INT DEFAULT NULL)
RETURNS INT AS $$
DECLARE
    v_gestion INT;
    v_next INT;
BEGIN
    v_gestion := COALESCE(p_gestion, EXTRACT(YEAR FROM CURRENT_DATE)::INT);
    INSERT INTO secuencia_hr (gestion, ultimo_numero)
    VALUES (v_gestion, 1)
    ON CONFLICT (gestion)
    DO UPDATE SET ultimo_numero = secuencia_hr.ultimo_numero + 1
    RETURNING ultimo_numero INTO v_next;
    RETURN v_next;
END;
$$ LANGUAGE plpgsql;

COMMIT;
