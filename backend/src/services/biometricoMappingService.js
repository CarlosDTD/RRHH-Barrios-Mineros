const db = require('../config/db');

class BiometricoMappingService {

  static async getSugerencias() {
    const result = await db.query(`
      SELECT 
        u.id as usuario_id,
        u.emp_pin,
        u.primer_nombre as nombre_biometrico,
        u.apellidos as apellidos_biometrico,
        u.dept_name,
        u.emp_active,
        p.id as personal_id,
        p.ci,
        p.primer_nombre as nombre_personal,
        p.apellido_paterno,
        p.apellido_materno,
        p.biometrico_id as biometrico_actual
      FROM biometrico_usuarios u
      LEFT JOIN personal p ON 
        (
          LOWER(TRIM(u.primer_nombre)) = LOWER(TRIM(p.primer_nombre))
          AND LOWER(TRIM(u.apellidos)) = LOWER(TRIM(CONCAT(p.apellido_paterno, ' ', p.apellido_materno)))
        )
        OR (
          LOWER(TRIM(u.primer_nombre)) LIKE '%' || LOWER(TRIM(p.primer_nombre)) || '%'
          AND LOWER(TRIM(u.apellidos)) LIKE '%' || LOWER(TRIM(CONCAT(p.apellido_paterno, ' ', p.apellido_materno))) || '%'
        )
      ORDER BY 
        CASE WHEN p.biometrico_id IS NOT NULL THEN 0 ELSE 1 END,
        u.primer_nombre
    `);

    return result.rows;
  }

  static async getNoVinculados() {
    const result = await db.query(`
      SELECT u.*
      FROM biometrico_usuarios u
      WHERE NOT EXISTS (
        SELECT 1 FROM personal p WHERE p.biometrico_id = u.emp_pin
      )
      ORDER BY u.primer_nombre
    `);
    return result.rows;
  }

  static async getVinculados() {
    const result = await db.query(`
      SELECT 
        u.id as usuario_id,
        u.emp_pin,
        u.primer_nombre,
        u.apellidos,
        u.dept_name,
        p.id as personal_id,
        p.ci,
        p.primer_nombre as nombre_personal,
        p.apellido_paterno,
        p.apellido_materno
      FROM biometrico_usuarios u
      INNER JOIN personal p ON p.biometrico_id = u.emp_pin
      ORDER BY u.primer_nombre
    `);
    return result.rows;
  }

  static async vincular(usuarioId, personalId) {
    const usuario = await db.query('SELECT emp_pin FROM biometrico_usuarios WHERE id = $1', [usuarioId]);
    if (usuario.rows.length === 0) throw new Error('Usuario biométrico no encontrado');

    const personal = await db.query('SELECT id FROM personal WHERE id = $1', [personalId]);
    if (personal.rows.length === 0) throw new Error('Personal no encontrado');

    const empPin = usuario.rows[0].emp_pin;

    await db.query('UPDATE personal SET biometrico_id = $1 WHERE id = $2', [empPin, personalId]);

    return { message: 'Vinculación exitosa', emp_pin: empPin, personal_id: personalId };
  }

  static async desvincular(personalId) {
    await db.query('UPDATE personal SET biometrico_id = NULL WHERE id = $1', [personalId]);
    return { message: 'Vinculación eliminada', personal_id: personalId };
  }

  static async getPersonalSinBiometrico() {
    const result = await db.query(`
      SELECT id, ci, primer_nombre, apellido_paterno, apellido_materno
      FROM personal
      WHERE biometrico_id IS NULL
      ORDER BY primer_nombre
    `);
    return result.rows;
  }

  static async vincularPorCI() {
    const result = await db.query(`
      UPDATE personal p
      SET biometrico_id = u.emp_pin
      FROM biometrico_usuarios u
      WHERE p.biometrico_id IS NULL
        AND u.emp_ssn = p.ci
        AND NOT EXISTS (
          SELECT 1 FROM personal p2 WHERE p2.biometrico_id = u.emp_pin
        )
      RETURNING p.id, p.ci, p.primer_nombre, p.apellido_paterno, u.emp_pin, u.primer_nombre as nombre_bio
    `);
    return {
      vinculados: result.rows,
      total: result.rowCount
    };
  }

  static async vincularMultiples(lista) {
    let exitosos = 0;
    let errores = [];
    for (const item of lista) {
      try {
        const usuario = await db.query('SELECT emp_pin FROM biometrico_usuarios WHERE id = $1', [item.usuario_id]);
        if (usuario.rows.length === 0) throw new Error(`Usuario biométrico ${item.usuario_id} no encontrado`);
        const personal = await db.query('SELECT id FROM personal WHERE id = $1', [item.personal_id]);
        if (personal.rows.length === 0) throw new Error(`Personal ${item.personal_id} no encontrado`);
        await db.query('UPDATE personal SET biometrico_id = $1 WHERE id = $2', [usuario.rows[0].emp_pin, item.personal_id]);
        exitosos++;
      } catch (e) {
        errores.push({ usuario_id: item.usuario_id, personal_id: item.personal_id, error: e.message });
      }
    }
    return { exitosos, errores, total: lista.length };
  }

  static async getResumen() {
    const result = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM biometrico_usuarios) as total_biometrico,
        (SELECT COUNT(*) FROM personal WHERE biometrico_id IS NOT NULL) as total_vinculados,
        (SELECT COUNT(*) FROM biometrico_usuarios u WHERE NOT EXISTS (
          SELECT 1 FROM personal p WHERE p.biometrico_id = u.emp_pin
        )) as sin_mapear
    `);
    return result.rows[0];
  }
}

module.exports = BiometricoMappingService;
