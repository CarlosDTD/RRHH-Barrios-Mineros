BEGIN;

-- 1. Catálogo de tipos de turno
CREATE TABLE IF NOT EXISTS cat_tipos_turno (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(10) UNIQUE NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  hora_inicio TIME,
  hora_fin TIME
);

INSERT INTO cat_tipos_turno (codigo, nombre, hora_inicio, hora_fin) VALUES
('M', 'MAÑANA', '07:00', '14:00'),
('T', 'TARDE', '14:00', '21:00'),
('N', 'NOCHE', '21:00', '07:00'),
('G24', 'GUARDIA 24H', '07:00', '07:00')
ON CONFLICT (codigo) DO NOTHING;

-- 2. Roles de turno por servicio
CREATE TABLE IF NOT EXISTS roles_turno (
  id SERIAL PRIMARY KEY,
  servicio_id INT NOT NULL REFERENCES cat_unidades_servicios(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  cantidad_requerida INT DEFAULT 1,
  prioridad_minima INT DEFAULT 5,
  activo BOOLEAN DEFAULT TRUE,
  UNIQUE(servicio_id, nombre)
);

-- 3. Personal autorizado para cada rol de turno
CREATE TABLE IF NOT EXISTS personal_roles_turno (
  id SERIAL PRIMARY KEY,
  personal_id INT NOT NULL REFERENCES personal(id) ON DELETE CASCADE,
  rol_turno_id INT NOT NULL REFERENCES roles_turno(id) ON DELETE CASCADE,
  prioridad INT DEFAULT 1,
  activo BOOLEAN DEFAULT TRUE,
  UNIQUE(personal_id, rol_turno_id)
);

-- 4. Planilla de turnos (calendarización real)
CREATE TABLE IF NOT EXISTS planilla_turnos (
  id SERIAL PRIMARY KEY,
  servicio_id INT NOT NULL REFERENCES cat_unidades_servicios(id),
  rol_turno_id INT NOT NULL REFERENCES roles_turno(id),
  personal_id INT NOT NULL REFERENCES personal(id),
  tipo_turno_id INT NOT NULL REFERENCES cat_tipos_turno(id),
  fecha DATE NOT NULL,
  es_guardia BOOLEAN DEFAULT FALSE,
  observaciones TEXT,
  generado_auto BOOLEAN DEFAULT FALSE,
  created_by INT REFERENCES usuarios(id),
  updated_by INT REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_planilla_fecha ON planilla_turnos(fecha);
CREATE INDEX IF NOT EXISTS idx_planilla_servicio ON planilla_turnos(servicio_id);

-- 5. Jefes de servicio (control de acceso)
CREATE TABLE IF NOT EXISTS jefes_servicio (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  servicio_id INT NOT NULL REFERENCES cat_unidades_servicios(id) ON DELETE CASCADE,
  UNIQUE(usuario_id, servicio_id)
);

-- 6. Agregar rol JEFE_SERVICIO si no existe
INSERT INTO roles (nombre, descripcion)
SELECT 'JEFE_SERVICIO', 'Jefe de servicio - gestiona turnos de su servicio'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'JEFE_SERVICIO');

-- 7. Agregar permiso de turnos si no existe
INSERT INTO permisos (codigo, descripcion, modulo)
SELECT 'turnos.gestionar', 'Gestionar turnos y planillas', 'turnos'
WHERE NOT EXISTS (SELECT 1 FROM permisos WHERE codigo = 'turnos.gestionar');

INSERT INTO permisos (codigo, descripcion, modulo)
SELECT 'turnos.ver', 'Ver planillas de turnos', 'turnos'
WHERE NOT EXISTS (SELECT 1 FROM permisos WHERE codigo = 'turnos.ver');

-- 8. Asignar permiso turnos.gestionar a ADMIN y JEFE_RRHH
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre IN ('ADMIN', 'JEFE_RRHH')
AND p.codigo = 'turnos.gestionar'
AND NOT EXISTS (
  SELECT 1 FROM rol_permisos rp WHERE rp.rol_id = r.id AND rp.permiso_id = p.id
);

-- 9. Asignar permiso turnos.ver a ADMIN, JEFE_RRHH, JEFE_SERVICIO, DIRECTOR
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre IN ('ADMIN', 'JEFE_RRHH', 'JEFE_SERVICIO', 'DIRECTOR')
AND p.codigo = 'turnos.ver'
AND NOT EXISTS (
  SELECT 1 FROM rol_permisos rp WHERE rp.rol_id = r.id AND rp.permiso_id = p.id
);

COMMIT;
