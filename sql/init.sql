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

-- ============================================================
-- MÓDULO DE CORRESPONDENCIA + AUTENTICACIÓN + ROLES
-- ============================================================

-- Tablas de Autenticación y Roles

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permisos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(255),
    modulo VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rol_permisos (
    rol_id INT REFERENCES roles(id) ON DELETE CASCADE,
    permiso_id INT REFERENCES permisos(id) ON DELETE CASCADE,
    PRIMARY KEY (rol_id, permiso_id)
);

CREATE TABLE usuarios (
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

CREATE TABLE usuario_roles (
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    rol_id INT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, rol_id)
);

-- Tablas de Correspondencia

CREATE TABLE cat_tipos_correspondencia (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE cat_clasificaciones (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE cat_etiquetas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#3b82f6'
);

CREATE TABLE secuencia_hr (
    gestion INT PRIMARY KEY,
    ultimo_numero INT DEFAULT 0
);

CREATE TABLE configuracion_cite (
    id INTEGER PRIMARY KEY DEFAULT 1,
    hospital_sigla VARCHAR(10) NOT NULL DEFAULT 'HBM',
    separador VARCHAR(5) NOT NULL DEFAULT '/',
    formato TEXT NOT NULL DEFAULT '{SIGLA}/{AREA}/{TIPO}/N° {NRO}/{GESTION}',
    gestion_actual INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    ultimo_numero INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unica_fila CHECK (id = 1)
);

CREATE TABLE correspondencia (
    id SERIAL PRIMARY KEY,
    hr_correlativo INT NOT NULL,
    gestion INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
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

CREATE TABLE correspondencia_etiquetas (
    correspondencia_id INT REFERENCES correspondencia(id) ON DELETE CASCADE,
    etiqueta_id INT REFERENCES cat_etiquetas(id) ON DELETE CASCADE,
    PRIMARY KEY (correspondencia_id, etiqueta_id)
);

CREATE TABLE derivaciones (
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

-- Función para generar HR correlativo por gestión

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

-- Datos iniciales: Roles, Catálogos y Configuración

INSERT INTO roles (nombre, descripcion) VALUES
('ADMIN', 'Administrador del sistema - acceso total'),
('SECRETARIO', 'Secretaría - registra y deriva correspondencia'),
('DIRECTOR', 'Director del hospital'),
('JEFE_RRHH', 'Jefe de Recursos Humanos'),
('AUXILIAR', 'Auxiliar de oficina');

INSERT INTO permisos (codigo, descripcion, modulo) VALUES
('correspondencia.ver', 'Ver correspondencia', 'correspondencia'),
('correspondencia.crear', 'Registrar nueva correspondencia', 'correspondencia'),
('correspondencia.editar', 'Editar correspondencia', 'correspondencia'),
('correspondencia.derivar', 'Derivar correspondencia', 'correspondencia'),
('correspondencia.responder', 'Responder derivaciones', 'correspondencia'),
('correspondencia.eliminar', 'Eliminar correspondencia', 'correspondencia'),
('usuarios.ver', 'Ver usuarios del sistema', 'usuarios'),
('usuarios.gestionar', 'Gestionar usuarios y roles', 'usuarios'),
('config.ver', 'Ver configuración del sistema', 'config'),
('config.editar', 'Editar configuración del sistema', 'config');

-- Asignar permisos a roles
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r, permisos p WHERE r.nombre = 'ADMIN';

INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre = 'SECRETARIO'
AND p.codigo IN ('correspondencia.ver', 'correspondencia.crear', 'correspondencia.editar',
                 'correspondencia.derivar', 'correspondencia.responder', 'correspondencia.eliminar');

INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre IN ('DIRECTOR', 'JEFE_RRHH')
AND p.codigo IN ('correspondencia.ver', 'correspondencia.derivar', 'correspondencia.responder');

INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre = 'AUXILIAR'
AND p.codigo IN ('correspondencia.ver', 'correspondencia.responder');

INSERT INTO cat_tipos_correspondencia (codigo, nombre) VALUES
('REC', 'Recepcionada'),
('INT', 'Interna'),
('EMIT', 'Emitida');

INSERT INTO cat_clasificaciones (codigo, nombre) VALUES
('SOL', 'Solicitud'),
('INF', 'Informe'),
('MEM', 'Memorándum'),
('OFI', 'Oficio'),
('CIR', 'Circular'),
('NOT', 'Nota'),
('RES', 'Resolución'),
('ACT', 'Acta');

INSERT INTO cat_etiquetas (nombre, color) VALUES
('Urgente', '#ef4444'),
('Confidencial', '#dc2626'),
('Reservado', '#f59e0b'),
('RRHH', '#3b82f6'),
('Dirección', '#8b5cf6'),
('Secretaría', '#10b981'),
('Administrativo', '#6366f1'),
('Personal', '#ec4899');

INSERT INTO configuracion_cite (id, hospital_sigla, separador, formato, gestion_actual, ultimo_numero)
VALUES (1, 'HBM', '/', '{SIGLA}/{AREA}/{TIPO}/N° {NRO}/{GESTION}', EXTRACT(YEAR FROM CURRENT_DATE)::INT, 0)
ON CONFLICT (id) DO UPDATE SET gestion_actual = EXCLUDED.gestion_actual;

-- El usuario admin por defecto se crea mediante: npm run seed (backend/src/seed/seedCorrespondencia.js)
-- Credenciales: admin / admin (exige cambio de contraseña en primer login)
