const db = require('../config/db');
const bcrypt = require('bcryptjs');

class UsuarioModel {
  static async findByUsername(username) {
    const { rows } = await db.query(`
      SELECT u.*, p.ci, p.primer_nombre, p.segundo_nombre,
             p.apellido_paterno, p.apellido_materno,
             vl.cargo_actual
      FROM usuarios u
      LEFT JOIN personal p ON u.personal_id = p.id
      LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id
      WHERE u.username = $1
    `, [username]);
    return rows[0];
  }

  static async findById(id) {
    const { rows } = await db.query(`
      SELECT u.*, p.ci, p.primer_nombre, p.segundo_nombre,
             p.apellido_paterno, p.apellido_materno,
             vl.cargo_actual
      FROM usuarios u
      LEFT JOIN personal p ON u.personal_id = p.id
      LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id
      WHERE u.id = $1
    `, [id]);
    return rows[0];
  }

  static async createFromPersonal(personalId, ci) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(ci, salt);

    const { rows } = await db.query(`
      INSERT INTO usuarios (personal_id, username, password_hash, password_cambiado)
      VALUES ($1, $2, $3, false)
      ON CONFLICT (username) 
      DO UPDATE SET personal_id = EXCLUDED.personal_id, activo = true
      RETURNING id, username, personal_id
    `, [personalId, ci, passwordHash]);

    await db.query(`
      INSERT INTO usuario_roles (usuario_id, rol_id)
      SELECT $1, id FROM roles WHERE nombre = 'AUXILIAR'
      ON CONFLICT DO NOTHING
    `, [rows[0].id]);

    return rows[0];
  }

  static async updatePassword(id, newPassword) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    const { rows } = await db.query(`
      UPDATE usuarios SET password_hash = $1, password_cambiado = true, updated_at = NOW()
      WHERE id = $2 RETURNING id
    `, [hash, id]);
    return rows[0];
  }

  static async getAll() {
    const { rows } = await db.query(`
      SELECT u.id, u.username, u.personal_id, u.email, u.activo,
             u.password_cambiado, u.ultimo_acceso, u.created_at,
             p.ci, p.primer_nombre, p.segundo_nombre,
             p.apellido_paterno, p.apellido_materno,
             vl.cargo_actual,
             COALESCE(
               array_agg(r.nombre) FILTER (WHERE r.nombre IS NOT NULL),
               '{}'
             ) as roles
      FROM usuarios u
      LEFT JOIN personal p ON u.personal_id = p.id
      LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id
      LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
      LEFT JOIN roles r ON ur.rol_id = r.id
      GROUP BY u.id, p.ci, p.primer_nombre, p.segundo_nombre,
               p.apellido_paterno, p.apellido_materno, vl.cargo_actual
      ORDER BY u.id
    `);
    return rows;
  }

  static async updateRoles(usuarioId, roleIds) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM usuario_roles WHERE usuario_id = $1', [usuarioId]);
      for (const rolId of roleIds) {
        await client.query(
          'INSERT INTO usuario_roles (usuario_id, rol_id) VALUES ($1, $2)',
          [usuarioId, rolId]
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async toggleActivo(id) {
    const { rows } = await db.query(`
      UPDATE usuarios SET activo = NOT activo, updated_at = NOW()
      WHERE id = $1 RETURNING id, activo
    `, [id]);
    return rows[0];
  }

  static async updateLastAccess(id) {
    await db.query('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = $1', [id]);
  }
}

module.exports = UsuarioModel;
