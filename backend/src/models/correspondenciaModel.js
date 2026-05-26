const db = require('../config/db');

class CorrespondenciaModel {
  static async getAll(filters = {}) {
    let query = `
      SELECT c.*,
             tc.nombre as tipo_nombre,
             cc.nombre as clasificacion_nombre,
             u_rec.username as recepcion_username,
             CONCAT(p_rec.primer_nombre, ' ', p_rec.apellido_paterno) as recepcion_nombre,
             u_rem.username as remitente_username,
             CONCAT(p_rem.primer_nombre, ' ', p_rem.apellido_paterno) as remitente_nombre,
             COALESCE(
               (SELECT jsonb_agg(jsonb_build_object('id', e.id, 'nombre', e.nombre, 'color', e.color))
                FROM correspondencia_etiquetas ce
                JOIN cat_etiquetas e ON ce.etiqueta_id = e.id
                WHERE ce.correspondencia_id = c.id),
               '[]'::jsonb
             ) as etiquetas,
             COALESCE(
               (SELECT COUNT(*) FROM derivaciones d WHERE d.correspondencia_id = c.id AND d.completada = false),
               0
             ) as derivaciones_pendientes,
             COUNT(*) OVER() as total_count
      FROM correspondencia c
      LEFT JOIN cat_tipos_correspondencia tc ON c.tipo_id = tc.id
      LEFT JOIN cat_clasificaciones cc ON c.clasificacion_id = cc.id
      LEFT JOIN usuarios u_rec ON c.usuario_recepcion_id = u_rec.id
      LEFT JOIN personal p_rec ON u_rec.personal_id = p_rec.id
      LEFT JOIN usuarios u_rem ON c.remitente_interno_id = u_rem.id
      LEFT JOIN personal p_rem ON u_rem.personal_id = p_rem.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.estado) {
      params.push(filters.estado);
      query += ` AND c.estado = $${params.length}`;
    }

    if (filters.tipo_id) {
      params.push(filters.tipo_id);
      query += ` AND c.tipo_id = $${params.length}`;
    }

    if (filters.clasificacion_id) {
      params.push(filters.clasificacion_id);
      query += ` AND c.clasificacion_id = $${params.length}`;
    }

    if (filters.busqueda) {
      params.push(`%${filters.busqueda}%`);
      query += ` AND (
        c.referencia ILIKE $${params.length} OR
        c.hr_completo ILIKE $${params.length} OR
        c.cite ILIKE $${params.length} OR
        c.remitente_externo ILIKE $${params.length}
      )`;
    }

    if (filters.usuario_id) {
      params.push(filters.usuario_id);
      query += ` AND c.id IN (
        SELECT correspondencia_id FROM derivaciones
        WHERE para_usuario_id = $${params.length} AND completada = false
      )`;
    }

    query += ' ORDER BY c.fecha_recepcion DESC';

    if (filters.limit) {
      params.push(filters.limit);
      query += ` LIMIT $${params.length}`;
      if (filters.offset !== undefined) {
        params.push(filters.offset);
        query += ` OFFSET $${params.length}`;
      }
    }

    const { rows } = await db.query(query, params);
    return rows;
  }

  static async getById(id) {
    const { rows } = await db.query(`
      SELECT c.*,
             tc.nombre as tipo_nombre, tc.codigo as tipo_codigo,
             cc.nombre as clasificacion_nombre, cc.codigo as clasificacion_codigo,
             u_rec.username as recepcion_username,
             CONCAT(p_rec.primer_nombre, ' ', p_rec.apellido_paterno) as recepcion_nombre,
             u_rem.username as remitente_username,
             CONCAT(p_rem.primer_nombre, ' ', p_rem.apellido_paterno) as remitente_nombre,
             COALESCE(
               (SELECT jsonb_agg(jsonb_build_object('id', e.id, 'nombre', e.nombre, 'color', e.color))
                FROM correspondencia_etiquetas ce
                JOIN cat_etiquetas e ON ce.etiqueta_id = e.id
                WHERE ce.correspondencia_id = c.id),
               '[]'::jsonb
             ) as etiquetas
      FROM correspondencia c
      LEFT JOIN cat_tipos_correspondencia tc ON c.tipo_id = tc.id
      LEFT JOIN cat_clasificaciones cc ON c.clasificacion_id = cc.id
      LEFT JOIN usuarios u_rec ON c.usuario_recepcion_id = u_rec.id
      LEFT JOIN personal p_rec ON u_rec.personal_id = p_rec.id
      LEFT JOIN usuarios u_rem ON c.remitente_interno_id = u_rem.id
      LEFT JOIN personal p_rem ON u_rem.personal_id = p_rem.id
      WHERE c.id = $1
    `, [id]);
    return rows[0];
  }

  static async create(data) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const hr = await client.query('SELECT next_hr($1) as hr', [data.gestion || 2026]);
      const hrCorrelativo = hr.rows[0].hr;

      const { rows } = await client.query(`
        INSERT INTO correspondencia (
          hr_correlativo, gestion, cite, tipo_id, clasificacion_id,
          remitente_externo, remitente_interno_id, destinatario_original,
          referencia, pdf_original, pdf_comprimido, folios,
          fecha_documento, usuario_recepcion_id, observaciones, estado
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
        RETURNING *
      `, [
        hrCorrelativo, data.gestion || 2026, data.cite || null,
        data.tipo_id, data.clasificacion_id,
        data.remitente_externo || null, data.remitente_interno_id || null,
        data.destinatario_original || null,
        data.referencia, data.pdf_original || null, data.pdf_comprimido || null,
        data.folios || null, data.fecha_documento,
        data.usuario_recepcion_id, data.observaciones || null,
        data.estado || 'recibido'
      ]);

      const correspondenciaId = rows[0].id;

      if (data.etiquetas && data.etiquetas.length > 0) {
        for (const etiquetaId of data.etiquetas) {
          await client.query(
            'INSERT INTO correspondencia_etiquetas (correspondencia_id, etiqueta_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [correspondenciaId, etiquetaId]
          );
        }
      }

      if (data.derivar_a) {
        await client.query(`
          INSERT INTO derivaciones (correspondencia_id, de_usuario_id, para_usuario_id, instruccion, orden)
          VALUES ($1, $2, $3, $4, 1)
        `, [correspondenciaId, data.usuario_recepcion_id, data.derivar_a, data.instruccion_derivacion || null]);
      }

      await client.query('COMMIT');
      return this.getById(correspondenciaId);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      if (['cite', 'tipo_id', 'clasificacion_id', 'remitente_externo',
           'destinatario_original', 'referencia', 'folios', 'fecha_documento',
           'observaciones', 'estado', 'pdf_original', 'pdf_comprimido'].includes(key)) {
        fields.push(`${key} = $${idx}`);
        values.push(value === undefined ? null : value);
        idx++;
      }
    }

    if (fields.length === 0) return this.getById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    await db.query(
      `UPDATE correspondencia SET ${fields.join(', ')} WHERE id = $${idx}`,
      values
    );

    if (data.etiquetas) {
      await db.query('DELETE FROM correspondencia_etiquetas WHERE correspondencia_id = $1', [id]);
      for (const etiquetaId of data.etiquetas) {
        await db.query(
          'INSERT INTO correspondencia_etiquetas (correspondencia_id, etiqueta_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [id, etiquetaId]
        );
      }
    }

    return this.getById(id);
  }

  static async getDerivaciones(correspondenciaId) {
    const { rows } = await db.query(`
      SELECT d.*,
             CONCAT(p_de.primer_nombre, ' ', p_de.apellido_paterno) as de_nombre,
             p_de.ci as de_ci,
             CONCAT(p_para.primer_nombre, ' ', p_para.apellido_paterno) as para_nombre,
             p_para.ci as para_ci,
             vl_de.cargo_actual as de_cargo,
             vl_para.cargo_actual as para_cargo
      FROM derivaciones d
      LEFT JOIN usuarios u_de ON d.de_usuario_id = u_de.id
      LEFT JOIN personal p_de ON u_de.personal_id = p_de.id
      LEFT JOIN vinculos_laborales vl_de ON p_de.id = vl_de.personal_id
      LEFT JOIN usuarios u_para ON d.para_usuario_id = u_para.id
      LEFT JOIN personal p_para ON u_para.personal_id = p_para.id
      LEFT JOIN vinculos_laborales vl_para ON p_para.id = vl_para.personal_id
      WHERE d.correspondencia_id = $1
      ORDER BY d.fecha_derivacion DESC
    `, [correspondenciaId]);
    return rows;
  }

  static async derivar(correspondenciaId, deUsuarioId, paraUsuarioId, instruccion) {
    const { rows: maxOrder } = await db.query(
      'SELECT COALESCE(MAX(orden), 0) + 1 as next_orden FROM derivaciones WHERE correspondencia_id = $1',
      [correspondenciaId]
    );

    const { rows } = await db.query(`
      INSERT INTO derivaciones (correspondencia_id, de_usuario_id, para_usuario_id, instruccion, orden)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [correspondenciaId, deUsuarioId, paraUsuarioId, instruccion, maxOrder[0].next_orden]);

    await db.query(
      "UPDATE correspondencia SET estado = 'derivado', updated_at = NOW() WHERE id = $1",
      [correspondenciaId]
    );

    return rows[0];
  }

  static async responder(derivacionId, usuarioId, respuesta) {
    const { rows } = await db.query(`
      UPDATE derivaciones
      SET respuesta = $1, fecha_respuesta = NOW(), completada = true
      WHERE id = $2 AND para_usuario_id = $3
      RETURNING *
    `, [respuesta, derivacionId, usuarioId]);

    if (rows.length > 0) {
      await db.query(
        "UPDATE correspondencia SET estado = 'respondido', updated_at = NOW() WHERE id = $1",
        [rows[0].correspondencia_id]
      );
    }

    return rows[0];
  }

  static async getBandeja(usuarioId) {
    const { rows } = await db.query(`
      SELECT d.id as derivacion_id, d.instruccion, d.fecha_derivacion, d.completada,
             CONCAT(p_de.primer_nombre, ' ', p_de.apellido_paterno) as de_nombre,
             c.id as correspondencia_id,
             c.hr_correlativo, c.gestion, c.referencia, c.estado,
             tc.nombre as tipo_nombre,
             cc.nombre as clasificacion_nombre
      FROM derivaciones d
      JOIN correspondencia c ON d.correspondencia_id = c.id
      LEFT JOIN cat_tipos_correspondencia tc ON c.tipo_id = tc.id
      LEFT JOIN cat_clasificaciones cc ON c.clasificacion_id = cc.id
      LEFT JOIN usuarios u_de ON d.de_usuario_id = u_de.id
      LEFT JOIN personal p_de ON u_de.personal_id = p_de.id
      WHERE d.para_usuario_id = $1
      ORDER BY d.completada ASC, d.fecha_derivacion DESC
    `, [usuarioId]);
    return rows;
  }

  static async getEstadisticas() {
    const { rows: totales } = await db.query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE estado = 'recibido') as recibidos,
        COUNT(*) FILTER (WHERE estado = 'derivado') as derivados,
        COUNT(*) FILTER (WHERE estado = 'respondido') as respondidos
      FROM correspondencia
    `);

    const { rows: porMes } = await db.query(`
      SELECT TO_CHAR(fecha_recepcion, 'YYYY-MM') as mes,
             COUNT(*) as total
      FROM correspondencia
      WHERE fecha_recepcion >= NOW() - INTERVAL '12 months'
      GROUP BY mes ORDER BY mes
    `);

    const { rows: porTipo } = await db.query(`
      SELECT tc.nombre, COUNT(*) as total
      FROM correspondencia c
      JOIN cat_tipos_correspondencia tc ON c.tipo_id = tc.id
      GROUP BY tc.nombre
    `);

    return { totales, porMes, porTipo };
  }
}

module.exports = CorrespondenciaModel;
