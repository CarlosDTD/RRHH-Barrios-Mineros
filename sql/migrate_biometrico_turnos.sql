BEGIN;

CREATE TABLE IF NOT EXISTS biometrico_turnos (
    id SERIAL PRIMARY KEY,
    personal_id INTEGER NOT NULL REFERENCES personal(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL DEFAULT 'Turno',
    hora_entrada TIME NOT NULL,
    hora_salida TIME NOT NULL,
    tolerancia_minutos INTEGER DEFAULT 15,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(personal_id)
);

CREATE INDEX IF NOT EXISTS idx_biometrico_turnos_personal ON biometrico_turnos (personal_id);

COMMIT;
