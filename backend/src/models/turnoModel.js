const db = require('../config/db');

class TurnoModel {
  // ==================== ROLES DE TURNO ====================
  static async getRolesByServicio(servicioId) {
    const { rows } = await db.query(`
      SELECT rt.*, us.nombre_unidad
      FROM roles_turno rt
      JOIN cat_unidades_servicios us ON rt.servicio_id = us.id
      WHERE rt.servicio_id = $1 AND rt.activo = true
      ORDER BY rt.nombre
    `, [servicioId]);
    return rows;
  }

  static async createRol(data) {
    const { servicio_id, nombre, cantidad_requerida, prioridad_minima } = data;
    const { rows } = await db.query(`
      INSERT INTO roles_turno (servicio_id, nombre, cantidad_requerida, prioridad_minima)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [servicio_id, nombre, cantidad_requerida || 1, prioridad_minima || 5]);
    return rows[0];
  }

  static async updateRol(id, data) {
    const fields = [];
    const params = [];
    let idx = 1;
    for (const key of ['nombre', 'cantidad_requerida', 'prioridad_minima', 'activo']) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${idx++}`);
        params.push(data[key]);
      }
    }
    if (fields.length === 0) return null;
    params.push(id);
    const { rows } = await db.query(`
      UPDATE roles_turno SET ${fields.join(', ')} WHERE id = $${idx}
      RETURNING *
    `, params);
    return rows[0];
  }

  static async deleteRol(id) {
    const { rows } = await db.query('DELETE FROM roles_turno WHERE id = $1 RETURNING *', [id]);
    return rows[0];
  }

  // ==================== PERSONAL ASIGNADO A ROLES ====================
  static async getPersonalByRol(rolTurnoId) {
    const { rows } = await db.query(`
      SELECT prt.*, p.ci, p.primer_nombre, p.segundo_nombre, p.apellido_paterno, p.apellido_materno,
             p.biometrico_id, p.estado,
             vl.cargo_actual, ff.nombre_fuente, ff.id as fuente_id, tp.nombre_tipo
      FROM personal_roles_turno prt
      JOIN personal p ON prt.personal_id = p.id
      LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id
      LEFT JOIN cat_fuentes_financiamiento ff ON vl.fuente_financiamiento_id = ff.id
      LEFT JOIN cat_tipos_personal tp ON vl.tipo_personal_id = tp.id
      WHERE prt.rol_turno_id = $1 AND prt.activo = true
      ORDER BY prt.prioridad ASC, ff.nombre_fuente ASC
    `, [rolTurnoId]);
    return rows;
  }

  static async assignPersonal(data) {
    const { personal_id, rol_turno_id, prioridad } = data;
    const { rows } = await db.query(`
      INSERT INTO personal_roles_turno (personal_id, rol_turno_id, prioridad)
      VALUES ($1, $2, $3)
      ON CONFLICT (personal_id, rol_turno_id)
      DO UPDATE SET prioridad = $3, activo = true
      RETURNING *
    `, [personal_id, rol_turno_id, prioridad || 1]);
    return rows[0];
  }

  static async removePersonal(id) {
    const { rows } = await db.query(
      'DELETE FROM personal_roles_turno WHERE id = $1 RETURNING *', [id]
    );
    return rows[0];
  }

  // ==================== PLANILLA DE TURNOS ====================
  static async getPlanilla(filtros) {
    const { servicio_id, fecha_desde, fecha_hasta, mes, anio } = filtros;
    const params = [];
    let query = `
      SELECT pt.*, rt.nombre as rol_nombre, rt.cantidad_requerida,
             tt.codigo as turno_codigo, tt.nombre as turno_nombre,
             p.ci, p.primer_nombre, p.segundo_nombre, p.apellido_paterno, p.apellido_materno,
             ff.nombre_fuente, ff.id as fuente_id,
             u.nombre_completo as creador_nombre
      FROM planilla_turnos pt
      JOIN roles_turno rt ON pt.rol_turno_id = rt.id
      JOIN cat_tipos_turno tt ON pt.tipo_turno_id = tt.id
      JOIN personal p ON pt.personal_id = p.id
      LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id
      LEFT JOIN cat_fuentes_financiamiento ff ON vl.fuente_financiamiento_id = ff.id
      LEFT JOIN (SELECT id, CONCAT(primer_nombre, ' ', apellido_paterno) as nombre_completo FROM personal) u ON pt.created_by = u.id
      WHERE 1=1
    `;
    let idx = 1;
    if (servicio_id) {
      query += ` AND pt.servicio_id = $${idx++}`;
      params.push(servicio_id);
    }
    if (fecha_desde && fecha_hasta) {
      query += ` AND pt.fecha BETWEEN $${idx++} AND $${idx++}`;
      params.push(fecha_desde, fecha_hasta);
    }
    if (mes && anio) {
      query += ` AND EXTRACT(MONTH FROM pt.fecha) = $${idx++} AND EXTRACT(YEAR FROM pt.fecha) = $${idx++}`;
      params.push(mes, anio);
    }
    query += ' ORDER BY pt.fecha ASC, rt.nombre ASC, tt.codigo ASC';
    const { rows } = await db.query(query, params);
    return rows;
  }

  static async createPlanillaItem(data) {
    const { servicio_id, rol_turno_id, personal_id, tipo_turno_id, fecha, es_guardia, observaciones, created_by } = data;
    const { rows } = await db.query(`
      INSERT INTO planilla_turnos (servicio_id, rol_turno_id, personal_id, tipo_turno_id, fecha, es_guardia, observaciones, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [servicio_id, rol_turno_id, personal_id, tipo_turno_id, fecha, es_guardia || false, observaciones || null, created_by]);
    return rows[0];
  }

  static async updatePlanillaItem(id, data) {
    const fields = [];
    const params = [];
    let idx = 1;
    for (const key of ['personal_id', 'tipo_turno_id', 'es_guardia', 'observaciones', 'updated_by']) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${idx++}`);
        params.push(data[key]);
      }
    }
    if (fields.length === 0) return null;
    params.push(id);
    const { rows } = await db.query(`
      UPDATE planilla_turnos SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx}
      RETURNING *
    `, params);
    return rows[0];
  }

  static async deletePlanillaItem(id) {
    const { rows } = await db.query('DELETE FROM planilla_turnos WHERE id = $1 RETURNING *', [id]);
    return rows[0];
  }

  // ==================== JEFES DE SERVICIO ====================
  static async getJefesServicio() {
    const { rows } = await db.query(`
      SELECT js.*, us.nombre_unidad,
             p.ci, p.primer_nombre, p.segundo_nombre, p.apellido_paterno, p.apellido_materno,
             u.username
      FROM jefes_servicio js
      JOIN cat_unidades_servicios us ON js.servicio_id = us.id
      JOIN usuarios u ON js.usuario_id = u.id
      LEFT JOIN personal p ON u.personal_id = p.id
      ORDER BY us.nombre_unidad
    `);
    return rows;
  }

  static async assignJefe(usuarioId, servicioId) {
    const { rows } = await db.query(`
      INSERT INTO jefes_servicio (usuario_id, servicio_id)
      VALUES ($1, $2)
      ON CONFLICT (usuario_id, servicio_id) DO NOTHING
      RETURNING *
    `, [usuarioId, servicioId]);
    return rows[0];
  }

  static async removeJefe(id) {
    const { rows } = await db.query('DELETE FROM jefes_servicio WHERE id = $1 RETURNING *', [id]);
    return rows[0];
  }

  static async getJefeServicioIds(usuarioId) {
    const { rows } = await db.query(
      'SELECT servicio_id FROM jefes_servicio WHERE usuario_id = $1', [usuarioId]
    );
    return rows.map(r => r.servicio_id);
  }

  // ==================== AUTO-DETECCIÓN DE JEFES ====================
  static async detectarPosiblesJefes() {
    const { rows } = await db.query(`
      SELECT DISTINCT p.id as personal_id, p.ci,
             CONCAT(p.primer_nombre, ' ', p.apellido_paterno) as nombre_completo,
             vl.cargo_actual, vl.unidad_servicio, vl.unidad_servicio_id,
             us.id as servicio_id_coincidente, us.nombre_unidad
      FROM personal p
      JOIN vinculos_laborales vl ON p.id = vl.personal_id
      LEFT JOIN cat_unidades_servicios us ON (
        us.nombre_unidad = TRIM(vl.unidad_servicio)
        OR us.nombre_unidad = REPLACE(TRIM(vl.unidad_servicio), '  ', ' ')
      )
      WHERE vl.cargo_actual IS NOT NULL
      AND (
        vl.cargo_actual ILIKE '%JEFE%'
        OR vl.cargo_actual ILIKE '%DIRECTOR%'
        OR vl.cargo_actual ILIKE '%RESPONSABLE%'
        OR vl.cargo_actual ILIKE '%ENCARGADO%'
        OR vl.cargo_actual ILIKE '%COORDINA%'
        OR vl.cargo_actual ILIKE '%GERENTE%'
        OR vl.cargo_actual ILIKE '%ADMINISTRADOR%'
      )
      ORDER BY vl.cargo_actual
    `);
    return rows;
  }

  // ==================== SUGERIR PERSONAL ====================
  static async sugerirPersonal(rolTurnoId, fecha) {
    const { rows } = await db.query(`
      WITH personal_habilitado AS (
        SELECT prt.personal_id, prt.prioridad as prioridad_asignacion,
               ff.id as fuente_id,
               CASE ff.nombre_fuente
                 WHEN 'TGN' THEN 1
                 WHEN 'HIPC' THEN 2
                 WHEN 'MINISTERIO' THEN 3
                 WHEN 'MUNICIPIO' THEN 4
                 ELSE 5
               END as prioridad_fuente,
               p.ci, CONCAT(p.primer_nombre, ' ', p.apellido_paterno) as nombre_completo,
               vl.cargo_actual, ff.nombre_fuente
        FROM personal_roles_turno prt
        JOIN personal p ON prt.personal_id = p.id
        LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id
        LEFT JOIN cat_fuentes_financiamiento ff ON vl.fuente_financiamiento_id = ff.id
        WHERE prt.rol_turno_id = $1 AND prt.activo = true AND p.estado = 'ACTIVO'
      ),
      ya_asignados AS (
        SELECT personal_id FROM planilla_turnos
        WHERE fecha = $2 AND rol_turno_id = $1
      ),
      turnos_mes AS (
        SELECT personal_id, COUNT(*) as total_turnos
        FROM planilla_turnos
        WHERE EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM $2::DATE)
        AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM $2::DATE)
        GROUP BY personal_id
      )
      SELECT ph.*, COALESCE(tm.total_turnos, 0) as turnos_mes
      FROM personal_habilitado ph
      LEFT JOIN ya_asignados ya ON ph.personal_id = ya.personal_id
      LEFT JOIN turnos_mes tm ON ph.personal_id = tm.personal_id
      WHERE ya.personal_id IS NULL
      ORDER BY ph.prioridad_fuente ASC, ph.prioridad_asignacion ASC, COALESCE(tm.total_turnos, 0) ASC
    `, [rolTurnoId, fecha]);
    return rows;
  }
}

module.exports = TurnoModel;
