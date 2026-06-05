const path = require('path');
const db = require('../config/db');

class BiometricoImportService {

  static async importarEmpleados(rutaSQLite) {
    const { DatabaseSync } = require('node:sqlite');
    const sqlite = new DatabaseSync(rutaSQLite);

    try {
      const empleados = sqlite.prepare(`
        SELECT e.*, d.dept_name
        FROM hr_employee e
        LEFT JOIN hr_department d ON e.emp_dept = d.id
        ORDER BY e.emp_pin
      `).all();

      let insertados = 0;
      let actualizados = 0;

      for (const emp of empleados) {
        const nombreCompleto = (emp.emp_firstname || '').trim();
        const apellidos = (emp.emp_lastname || '').trim();
        const nombres = nombreCompleto;

        const result = await db.query(`
          INSERT INTO biometrico_usuarios 
            (emp_pin, emp_code, emp_ssn, primer_nombre, apellidos, emp_dept_id, dept_name, emp_active, emp_hiredate, emp_birthday, emp_phone, emp_title, emp_gender, emp_cardNumber, emp_email)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
          ON CONFLICT (emp_pin) DO UPDATE SET
            primer_nombre = EXCLUDED.primer_nombre,
            apellidos = EXCLUDED.apellidos,
            emp_dept_id = EXCLUDED.emp_dept_id,
            dept_name = EXCLUDED.dept_name,
            emp_active = EXCLUDED.emp_active,
            emp_hiredate = EXCLUDED.emp_hiredate,
            emp_birthday = EXCLUDED.emp_birthday,
            emp_phone = EXCLUDED.emp_phone,
            emp_title = EXCLUDED.emp_title,
            emp_cardNumber = EXCLUDED.emp_cardNumber,
            emp_email = EXCLUDED.emp_email
        `, [
          String(emp.emp_pin),
          emp.emp_code || null,
          emp.emp_ssn || null,
          nombres || null,
          apellidos || null,
          emp.emp_dept || null,
          emp.dept_name || null,
          emp.emp_active ?? 1,
          emp.emp_hiredate || null,
          emp.emp_birthday || null,
          emp.emp_phone || null,
          emp.emp_title || null,
          emp.emp_gender ?? null,
          emp.emp_cardNumber || null,
          emp.emp_email || null
        ]);

        if (result.rowCount > 0) {
          const exists = await db.query('SELECT 1 FROM biometrico_usuarios WHERE emp_pin = $1', [String(emp.emp_pin)]);
          if (exists.rowCount > 0) actualizados++;
          else insertados++;
        }
      }

      return { total: empleados.length, insertados, actualizados };
    } finally {
      sqlite.close();
    }
  }

  static async importarDepartamentos(rutaSQLite) {
    const { DatabaseSync } = require('node:sqlite');
    const sqlite = new DatabaseSync(rutaSQLite);

    try {
      const depts = sqlite.prepare('SELECT * FROM hr_department ORDER BY id').all();
      return { total: depts.length, departamentos: depts };
    } finally {
      sqlite.close();
    }
  }

  static async importarMarcaciones(rutaSQLite, desde, hasta) {
    const { DatabaseSync } = require('node:sqlite');
    const sqlite = new DatabaseSync(rutaSQLite);

    try {
      let query = `
        SELECT p.*, e.emp_pin 
        FROM att_punches p
        JOIN hr_employee e ON p.emp_id = e.id
      `;
      const params = [];
      const condiciones = [];

      if (desde) {
        params.push(desde);
        condiciones.push(`p.punch_time >= ?`);
      }
      if (hasta) {
        params.push(hasta);
        condiciones.push(`p.punch_time <= ?`);
      }

      if (condiciones.length > 0) {
        query += ' WHERE ' + condiciones.join(' AND ');
      }

      query += ' ORDER BY p.punch_time ASC';

      const stmt = sqlite.prepare(query);
      const registros = stmt.all(...params);

      let importados = 0;
      let duplicados = 0;

      for (const reg of registros) {
        try {
          await db.query(`
            INSERT INTO biometrico_logs_raw (biometrico_id, timestamp, verificacion_tipo, estado_asistencia, device_ip, origen)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (biometrico_id, timestamp) DO NOTHING
          `, [
            String(reg.emp_pin),
            reg.punch_time,
            reg.workstate ?? 0,
            reg.workcode ?? 0,
            'SQLITE_IMPORT',
            'HISTORICO'
          ]);
          importados++;
        } catch (e) {
          if (e.code === '23505') duplicados++;
        }
      }

      // Actualizar estadísticas
      const stats = await db.query(`
        SELECT COUNT(*) as total, MIN(timestamp) as desde, MAX(timestamp) as hasta
        FROM biometrico_logs_raw WHERE origen = 'HISTORICO'
      `);

      return {
        totalProcesados: registros.length,
        importados,
        duplicados,
        rango: stats.rows[0]
      };
    } finally {
      sqlite.close();
    }
  }

  static async getStatsImportacion() {
    const result = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM biometrico_usuarios) as total_empleados,
        (SELECT COUNT(*) FROM biometrico_logs_raw WHERE origen = 'HISTORICO') as total_marcaciones_historicas,
        (SELECT COUNT(*) FROM biometrico_logs_raw WHERE origen = 'LIVE') as total_marcaciones_vivo,
        (SELECT MIN(timestamp) FROM biometrico_logs_raw) as primera_marcacion,
        (SELECT MAX(timestamp) FROM biometrico_logs_raw) as ultima_marcacion,
        (SELECT COUNT(*) FROM biometrico_usuarios u WHERE EXISTS (
          SELECT 1 FROM personal p WHERE p.biometrico_id = u.emp_pin
        )) as empleados_mapeados,
        (SELECT COUNT(*) FROM biometrico_usuarios u WHERE NOT EXISTS (
          SELECT 1 FROM personal p WHERE p.biometrico_id = u.emp_pin
        )) as empleados_sin_mapear
    `);
    return result.rows[0];
  }
}

module.exports = BiometricoImportService;
