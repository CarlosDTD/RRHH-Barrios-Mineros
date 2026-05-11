const db = require('../config/db');

class PersonalModel {
  static async getAll(filters = {}) {
    let query = `
      SELECT p.*, e.sigla as expedicion, prof.nombre_profesion
      FROM personal p
      LEFT JOIN cat_expediciones e ON p.exp_id = e.id
      LEFT JOIN cat_profesiones prof ON p.profesion_id = prof.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.ci) {
      params.push(`%${filters.ci}%`);
      query += ` AND p.ci LIKE $${params.length}`;
    }

    if (filters.nombre) {
      params.push(`%${filters.nombre}%`);
      query += ` AND (p.primer_nombre ILIKE $${params.length} OR p.apellido_paterno ILIKE $${params.length})`;
    }

    query += ' ORDER BY p.apellido_paterno ASC';
    const { rows } = await db.query(query, params);
    return rows;
  }

  static async create(data) {
    const {
      ci, complemento, exp_id, apellido_paterno, apellido_materno, 
      apellido_casada, primer_nombre, segundo_nombre, tercer_nombre, 
      fecha_nacimiento, profesion_id, telefono
    } = data;

    const query = `
      INSERT INTO personal (
        ci, complemento, exp_id, apellido_paterno, apellido_materno, 
        apellido_casada, primer_nombre, segundo_nombre, tercer_nombre, 
        fecha_nacimiento, profesion_id, telefono
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    const values = [
      ci || null, 
      complemento || null, 
      exp_id || null, 
      apellido_paterno || null, 
      apellido_materno || null, 
      apellido_casada || null, 
      primer_nombre || null, 
      segundo_nombre || null, 
      tercer_nombre || null, 
      fecha_nacimiento || null, 
      profesion_id || null, 
      telefono || null
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async getById(id) {
    const query = 'SELECT * FROM personal WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  static async update(id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data).map(val => val === '' ? null : val);
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    
    const query = `UPDATE personal SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
    const { rows } = await db.query(query, [...values, id]);
    return rows[0];
  }
}

module.exports = PersonalModel;
