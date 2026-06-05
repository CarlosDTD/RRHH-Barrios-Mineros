const db = require('../config/db');

class BiometricoAsistenciaService {

  static async procesarAsistencia(mes, anio) {
    const result = await db.query(`
      WITH marcaciones_dia AS (
        SELECT 
          p.id as personal_id,
          p.ci,
          p.primer_nombre,
          p.apellido_paterno,
          l.timestamp::DATE as fecha,
          MIN(l.timestamp) as primera_marcacion,
          MAX(l.timestamp) as ultima_marcacion,
          COUNT(*) as total_marcaciones
        FROM biometrico_logs_raw l
        INNER JOIN personal p ON p.biometrico_id = l.biometrico_id
        WHERE EXTRACT(MONTH FROM l.timestamp) = $1
          AND EXTRACT(YEAR FROM l.timestamp) = $2
        GROUP BY p.id, p.ci, p.primer_nombre, p.apellido_paterno, l.timestamp::DATE
        ORDER BY p.apellido_paterno, fecha
      )
      SELECT * FROM marcaciones_dia
    `, [mes, anio]);

    return result.rows;
  }

  static async getResumenMensual(mes, anio) {
    const result = await db.query(`
      SELECT 
        p.id as personal_id,
        p.ci,
        p.primer_nombre,
        p.apellido_paterno,
        p.apellido_materno,
        COUNT(DISTINCT l.timestamp::DATE) as dias_trabajados,
        COUNT(*) as total_marcaciones,
        MIN(l.timestamp::TIME) as hora_entrada_promedio,
        MAX(l.timestamp::TIME) as hora_salida_promedio
      FROM biometrico_logs_raw l
      INNER JOIN personal p ON p.biometrico_id = l.biometrico_id
      WHERE EXTRACT(MONTH FROM l.timestamp) = $1
        AND EXTRACT(YEAR FROM l.timestamp) = $2
      GROUP BY p.id, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno
      ORDER BY p.apellido_paterno
    `, [mes, anio]);

    return result.rows;
  }

  static async getMarcacionesPorDia(mes, anio, personalId) {
    const result = await db.query(`
      SELECT 
        l.timestamp,
        l.timestamp::DATE as fecha,
        l.timestamp::TIME as hora,
        l.verificacion_tipo,
        l.estado_asistencia,
        l.origen
      FROM biometrico_logs_raw l
      INNER JOIN personal p ON p.biometrico_id = l.biometrico_id
      WHERE p.id = $1
        AND EXTRACT(MONTH FROM l.timestamp) = $2
        AND EXTRACT(YEAR FROM l.timestamp) = $3
      ORDER BY l.timestamp ASC
    `, [personalId, mes, anio]);

    return result.rows;
  }

  static async getPersonasConAsistencia(mes, anio) {
    const result = await db.query(`
      SELECT DISTINCT
        p.id,
        p.ci,
        p.primer_nombre,
        p.apellido_paterno,
        p.apellido_materno
      FROM biometrico_logs_raw l
      INNER JOIN personal p ON p.biometrico_id = l.biometrico_id
      WHERE EXTRACT(MONTH FROM l.timestamp) = $1
        AND EXTRACT(YEAR FROM l.timestamp) = $2
      ORDER BY p.apellido_paterno
    `, [mes, anio]);

    return result.rows;
  }
}

module.exports = BiometricoAsistenciaService;
