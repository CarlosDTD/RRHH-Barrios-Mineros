const db = require('../config/db');

class BiometricoTurnoService {

  static async getTurnos() {
    const result = await db.query(`
      SELECT 
        bt.*,
        p.ci,
        p.primer_nombre,
        p.apellido_paterno,
        p.apellido_materno
      FROM biometrico_turnos bt
      INNER JOIN personal p ON bt.personal_id = p.id
      ORDER BY p.apellido_paterno, p.primer_nombre
    `);
    return result.rows;
  }

  static async getTurnoByPersonalId(personalId) {
    const result = await db.query(`
      SELECT * FROM biometrico_turnos WHERE personal_id = $1
    `, [personalId]);
    return result.rows[0] || null;
  }

  static async asignarTurno(personalId, nombre, horaEntrada, horaSalida, toleranciaMinutos = 15) {
    const exists = await db.query('SELECT id FROM personal WHERE id = $1', [personalId]);
    if (exists.rows.length === 0) throw new Error('Personal no encontrado');

    const result = await db.query(`
      INSERT INTO biometrico_turnos (personal_id, nombre, hora_entrada, hora_salida, tolerancia_minutos)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (personal_id) DO UPDATE SET
        nombre = EXCLUDED.nombre,
        hora_entrada = EXCLUDED.hora_entrada,
        hora_salida = EXCLUDED.hora_salida,
        tolerancia_minutos = EXCLUDED.tolerancia_minutos,
        activo = true,
        actualizado_en = CURRENT_TIMESTAMP
      RETURNING *
    `, [personalId, nombre || 'Turno', horaEntrada, horaSalida, toleranciaMinutos]);
    return result.rows[0];
  }

  static async eliminarTurno(personalId) {
    await db.query('DELETE FROM biometrico_turnos WHERE personal_id = $1', [personalId]);
    return { message: 'Turno eliminado', personal_id: personalId };
  }

  static async verificarAsistencia(personalId, mes, anio) {
    const turno = await this.getTurnoByPersonalId(personalId);
    if (!turno) throw new Error('El personal no tiene un turno asignado');

    const marcaciones = await db.query(`
      SELECT 
        l.timestamp::DATE as fecha,
        MIN(l.timestamp) as primera_marcacion,
        MAX(l.timestamp) as ultima_marcacion,
        COUNT(*) as total_marcaciones
      FROM biometrico_logs_raw l
      INNER JOIN personal p ON p.biometrico_id = l.biometrico_id
      WHERE p.id = $1
        AND EXTRACT(MONTH FROM l.timestamp) = $2
        AND EXTRACT(YEAR FROM l.timestamp) = $3
      GROUP BY l.timestamp::DATE
      ORDER BY l.timestamp::DATE
    `, [personalId, mes, anio]);

    const tolerancia = turno.tolerancia_minutos || 15;
    const diasDelMes = new Date(anio, mes, 0).getDate();
    const verificacion = [];

    for (let dia = 1; dia <= diasDelMes; dia++) {
      const fecha = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      const fechaDate = new Date(fecha);
      if (fechaDate.getDay() === 0 || fechaDate.getDay() === 6) continue;

      const registro = marcaciones.rows.find(r => {
        const rFecha = new Date(r.fecha);
        return rFecha.getDate() === dia && rFecha.getMonth() + 1 === mes && rFecha.getFullYear() === anio;
      });

      if (!registro) {
        verificacion.push({ fecha, dia, estado: 'SIN_MARCACION', entrada: null, salida: null });
        continue;
      }

      const entrada = new Date(registro.primera_marcacion);
      const salida = new Date(registro.ultima_marcacion);
      const entradaHora = `${String(entrada.getHours()).padStart(2, '0')}:${String(entrada.getMinutes()).padStart(2, '0')}`;
      const salidaHora = `${String(salida.getHours()).padStart(2, '0')}:${String(salida.getMinutes()).padStart(2, '0')}`;

      const [hEnt, mEnt] = turno.hora_entrada.split(':').map(Number);
      const [hSal, mSal] = turno.hora_salida.split(':').map(Number);
      const turnoEntradaMinutos = hEnt * 60 + mEnt;
      const turnoSalidaMinutos = hSal * 60 + mSal;
      const entradaMinutos = entrada.getHours() * 60 + entrada.getMinutes();
      const salidaMinutos = salida.getHours() * 60 + salida.getMinutes();

      const entradaOk = Math.abs(entradaMinutos - turnoEntradaMinutos) <= tolerancia;
      const salidaOk = Math.abs(salidaMinutos - turnoSalidaMinutos) <= tolerancia;

      if (entradaOk && salidaOk) {
        verificacion.push({ fecha, dia, estado: 'CUMPLE', entrada: entradaHora, salida: salidaHora });
      } else if (!entradaOk && !salidaOk) {
        verificacion.push({ fecha, dia, estado: 'NO_CUMPLE', entrada: entradaHora, salida: salidaHora });
      } else if (!entradaOk) {
        verificacion.push({ fecha, dia, estado: 'ENTRADA_TARDIA', entrada: entradaHora, salida: salidaHora });
      } else {
        verificacion.push({ fecha, dia, estado: 'SALIDA_TEMPRANO', entrada: entradaHora, salida: salidaHora });
      }
    }

    return {
      turno,
      verificacion,
      resumen: {
        total_dias: verificacion.length,
        cumple: verificacion.filter(v => v.estado === 'CUMPLE').length,
        no_cumple: verificacion.filter(v => v.estado === 'NO_CUMPLE' || v.estado === 'ENTRADA_TARDIA' || v.estado === 'SALIDA_TEMPRANO').length,
        sin_marcacion: verificacion.filter(v => v.estado === 'SIN_MARCACION').length
      }
    };
  }

  static async getPersonalSinTurno() {
    const result = await db.query(`
      SELECT p.id, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno
      FROM personal p
      WHERE p.biometrico_id IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM biometrico_turnos bt WHERE bt.personal_id = p.id)
      ORDER BY p.apellido_paterno
    `);
    return result.rows;
  }

  static async getPersonalConTurno() {
    const result = await db.query(`
      SELECT p.id, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno
      FROM personal p
      WHERE EXISTS (SELECT 1 FROM biometrico_turnos bt WHERE bt.personal_id = p.id AND bt.activo = true)
      ORDER BY p.apellido_paterno
    `);
    return result.rows;
  }
}

module.exports = BiometricoTurnoService;
