BEGIN;

-- 1. Tabla para almacenar usuarios importados desde ZKTimeNet.db
CREATE TABLE IF NOT EXISTS biometrico_usuarios (
    id SERIAL PRIMARY KEY,
    emp_pin VARCHAR(50) NOT NULL,
    emp_code VARCHAR(64),
    emp_ssn VARCHAR(64),
    primer_nombre VARCHAR(128),
    apellidos VARCHAR(128),
    emp_dept_id INTEGER,
    dept_name VARCHAR(128),
    emp_active INTEGER DEFAULT 1,
    emp_hiredate DATE,
    emp_birthday DATE,
    emp_phone VARCHAR(20),
    emp_title VARCHAR(64),
    emp_gender INTEGER,
    emp_cardNumber VARCHAR(24),
    emp_email VARCHAR(64),
    importado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(emp_pin)
);

CREATE INDEX IF NOT EXISTS idx_biometrico_usuarios_nombre ON biometrico_usuarios (primer_nombre, apellidos);
CREATE INDEX IF NOT EXISTS idx_biometrico_usuarios_pin ON biometrico_usuarios (emp_pin);

-- 2. Agregar columna de origen a biometrico_logs_raw (para distinguir importación masiva vs sync en vivo)
ALTER TABLE biometrico_logs_raw ADD COLUMN IF NOT EXISTS origen VARCHAR(20) DEFAULT 'LIVE';

-- 3. Crear o reemplazar función de matching por nombre (Levenshtein simple)
CREATE OR REPLACE FUNCTION normalizar_texto(t TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(TRIM(REGEXP_REPLACE(COALESCE(t, ''), '[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ ]', '', 'g')));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMIT;
