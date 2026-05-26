const db = require('../config/db');
const UsuarioModel = require('./usuarioModel');

class PersonalModel {
  static async getAll(filters = {}) {
    let query = `
      SELECT 
        p.*, 
        e.sigla as expedicion, 
        prof.nombre_profesion,
        vl.identificador_laboral,
        vl.cargo_actual,
        vl.cargo_planilla,
        vl.cargo_escala,
        vl.nro_resumen_ejecutivo,
        vl.unidad_servicio,
        vl.fecha_ingreso,
        ff.nombre_fuente,
        tp.nombre_tipo as tipo_personal,
        est.nombre_establecimiento,
        COUNT(*) OVER() as total_count
      FROM personal p
      LEFT JOIN cat_expediciones e ON p.exp_id = e.id
      LEFT JOIN cat_profesiones prof ON p.profesion_id = prof.id
      LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id
      LEFT JOIN cat_fuentes_financiamiento ff ON vl.fuente_financiamiento_id = ff.id
      LEFT JOIN cat_tipos_personal tp ON vl.tipo_personal_id = tp.id
      LEFT JOIN establecimientos est ON vl.establecimiento_id = est.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.ci) {
      params.push(`%${filters.ci}%`);
      query += ` AND p.ci LIKE $${params.length}`;
    }

    if (filters.nombre) {
      const searchTerms = filters.nombre.split(' ').filter(term => term.trim() !== '');
      if (searchTerms.length > 0) {
        const nameConditions = searchTerms.map((term, i) => {
          const paramIndex = params.length + 1;
          params.push(`%${term}%`);
          return `(
            p.primer_nombre ILIKE $${paramIndex} OR 
            p.segundo_nombre ILIKE $${paramIndex} OR 
            p.apellido_paterno ILIKE $${paramIndex} OR 
            p.apellido_materno ILIKE $${paramIndex} OR
            p.apellido_casada ILIKE $${paramIndex}
          )`;
        });
        query += ` AND (${nameConditions.join(' AND ')})`;
      }
    }

    if (filters.item) {
      params.push(`%${filters.item}%`);
      query += ` AND vl.identificador_laboral LIKE $${params.length}`;
    }

    if (filters.fuentes && filters.fuentes.length > 0) {
      const placeholders = filters.fuentes.map((_, i) => `$${params.length + i + 1}`).join(',');
      query += ` AND vl.fuente_financiamiento_id IN (${placeholders})`;
      params.push(...filters.fuentes);
    }

    const sortColumns = {
      ci: 'p.ci',
      nombre: 'p.apellido_paterno',
      cargo: 'vl.cargo_actual',
      profesion: 'prof.nombre_profesion',
      telefono: 'p.telefono',
      fecha_ingreso: 'vl.fecha_ingreso',
    };

    if (filters.sort && sortColumns[filters.sort]) {
      const order = filters.order === 'ASC' ? 'ASC' : 'DESC';
      query += ` ORDER BY ${sortColumns[filters.sort]} ${order}`;
    } else {
      query += ' ORDER BY p.id DESC';
    }

    if (filters.limit && filters.offset !== undefined) {
      params.push(filters.limit);
      query += ` LIMIT $${params.length}`;
      params.push(filters.offset);
      query += ` OFFSET $${params.length}`;
    }

    const { rows } = await db.query(query, params);
    return rows;
  }

  static async create(data) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const {
        ci, complemento, exp_id, apellido_paterno, apellido_materno, 
        apellido_casada, primer_nombre, segundo_nombre, tercer_nombre, 
        fecha_nacimiento, profesion_id, telefono,
        // Datos laborales
        establecimiento_id, tipo_personal_id, fuente_financiamiento_id,
        identificador_laboral, unidad_servicio, cargo_actual,
        cargo_planilla, cargo_escala, nro_resumen_ejecutivo,
        carga_horaria, fecha_ingreso, fecha_institucionalizacion, observaciones
      } = data;

      const personalQuery = `
        INSERT INTO personal (
          ci, complemento, exp_id, apellido_paterno, apellido_materno, 
          apellido_casada, primer_nombre, segundo_nombre, tercer_nombre, 
          fecha_nacimiento, profesion_id, telefono
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id
      `;
      const personalValues = [
        ci || null, complemento || null, exp_id || null, 
        apellido_paterno || null, apellido_materno || null, apellido_casada || null, 
        primer_nombre, segundo_nombre || null, tercer_nombre || null, 
        fecha_nacimiento || null, profesion_id || null, telefono || null
      ];

      const { rows: personalRows } = await client.query(personalQuery, personalValues);
      const personalId = personalRows[0].id;

      const laboralQuery = `
        INSERT INTO vinculos_laborales (
          personal_id, establecimiento_id, tipo_personal_id, fuente_financiamiento_id,
          identificador_laboral, unidad_servicio, cargo_actual,
          cargo_planilla, cargo_escala, nro_resumen_ejecutivo,
          carga_horaria, fecha_ingreso, fecha_institucionalizacion, observaciones
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `;
      const laboralValues = [
        personalId, establecimiento_id || null, tipo_personal_id || null, 
        fuente_financiamiento_id || null, identificador_laboral || null, 
        unidad_servicio || null, cargo_actual || null, 
        cargo_planilla || null, cargo_escala || null, nro_resumen_ejecutivo || null,
        carga_horaria || null, fecha_ingreso || null, fecha_institucionalizacion || null, observaciones || null
      ];

      await client.query(laboralQuery, laboralValues);

      await UsuarioModel.createFromPersonal(personalId, ci);
      
      await client.query('COMMIT');
      return { id: personalId, ...data };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getById(id) {
    const query = 'SELECT * FROM personal WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  static async update(id, data) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const personalFields = [
        'ci', 'complemento', 'exp_id', 'apellido_paterno', 'apellido_materno', 
        'apellido_casada', 'primer_nombre', 'segundo_nombre', 'tercer_nombre', 
        'fecha_nacimiento', 'profesion_id', 'telefono'
      ];

      const laboralFields = [
        'establecimiento_id', 'tipo_personal_id', 'fuente_financiamiento_id',
        'identificador_laboral', 'unidad_servicio', 'cargo_actual',
        'cargo_planilla', 'cargo_escala', 'nro_resumen_ejecutivo',
        'carga_horaria', 'fecha_ingreso', 'fecha_institucionalizacion', 'observaciones'
      ];

      // Actualizar Personal
      const personalData = {};
      personalFields.forEach(f => { if (data[f] !== undefined) personalData[f] = data[f] === '' ? null : data[f]; });
      
      if (Object.keys(personalData).length > 0) {
        const fields = Object.keys(personalData);
        const values = Object.values(personalData);
        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        await client.query(`UPDATE personal SET ${setClause} WHERE id = $${fields.length + 1}`, [...values, id]);
      }

      // Actualizar Vínculo Laboral
      const laboralData = {};
      laboralFields.forEach(f => { if (data[f] !== undefined) laboralData[f] = data[f] === '' ? null : data[f]; });

      if (Object.keys(laboralData).length > 0) {
        // Antes de actualizar, obtener el estado anterior para el historial
        const { rows: oldLaboral } = await client.query('SELECT * FROM vinculos_laborales WHERE personal_id = $1', [id]);
        
        const fields = Object.keys(laboralData);
        const values = Object.values(laboralData);
        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        
        // Verificar si existe el vínculo, si no, crearlo (upsert)
        const { rowCount } = await client.query(`UPDATE vinculos_laborales SET ${setClause} WHERE personal_id = $${fields.length + 1}`, [...values, id]);
        
        if (rowCount === 0) {
          const columns = ['personal_id', ...fields].join(', ');
          const placeholders = ['personal_id', ...fields].map((_, i) => `$${i + 1}`).join(', ');
          await client.query(`INSERT INTO vinculos_laborales (${columns}) VALUES (${placeholders})`, [id, ...values]);
        } else if (oldLaboral.length > 0) {
          // Si hubo cambios en campos clave, registrar en historial
          const keyFields = ['cargo_actual', 'identificador_laboral', 'unidad_servicio', 'establecimiento_id'];
          const hasChanges = keyFields.some(field => 
            data[field] !== undefined && String(data[field]) !== String(oldLaboral[0][field])
          );

          if (hasChanges) {
            const oldState = {};
            const newState = {};
            keyFields.forEach(field => {
              oldState[field] = oldLaboral[0][field];
              newState[field] = data[field] !== undefined ? data[field] : oldLaboral[0][field];
            });

            await client.query(`
              INSERT INTO historial_movimientos (personal_id, tipo_movimiento, detalles_anteriores, detalles_nuevos, motivo)
              VALUES ($1, $2, $3, $4, $5)
            `, [id, 'Actualización de Datos Laborales', JSON.stringify(oldState), JSON.stringify(newState), 'Cambio detectado mediante edición de formulario']);
          }
        }
      }

      await client.query('COMMIT');
      return { id, ...data };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = PersonalModel;
