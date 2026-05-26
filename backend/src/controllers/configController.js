const db = require('../config/db');

const getCiteConfig = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM configuracion_cite WHERE id = 1');
    if (rows.length === 0) {
      const { rows: created } = await db.query(`
        INSERT INTO configuracion_cite (id, hospital_sigla, separador, formato, gestion_actual, ultimo_numero)
        VALUES (1, 'HBM', '/', '{SIGLA}/{AREA}/{TIPO}/N° {NRO}/{GESTION}', EXTRACT(YEAR FROM CURRENT_DATE)::INT, 0)
        RETURNING *
      `);
      return res.json(created[0]);
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCiteConfig = async (req, res) => {
  try {
    const { hospital_sigla, separador, formato, gestion_actual } = req.body;

    const fields = [];
    const values = [];
    let idx = 1;

    if (hospital_sigla !== undefined) {
      fields.push(`hospital_sigla = $${idx++}`);
      values.push(hospital_sigla);
    }
    if (separador !== undefined) {
      fields.push(`separador = $${idx++}`);
      values.push(separador);
    }
    if (formato !== undefined) {
      fields.push(`formato = $${idx++}`);
      values.push(formato);
    }
    if (gestion_actual !== undefined) {
      fields.push(`gestion_actual = $${idx++}`);
      values.push(gestion_actual);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    fields.push('updated_at = NOW()');
    values.push(1);

    const { rows } = await db.query(
      `UPDATE configuracion_cite SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEtiquetas = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM cat_etiquetas ORDER BY nombre');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEtiqueta = async (req, res) => {
  try {
    const { nombre, color } = req.body;
    if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });
    const { rows } = await db.query(
      'INSERT INTO cat_etiquetas (nombre, color) VALUES ($1, $2) RETURNING *',
      [nombre, color || '#3b82f6']
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Ya existe una etiqueta con ese nombre' });
    }
    res.status(500).json({ error: error.message });
  }
};

const deleteEtiqueta = async (req, res) => {
  try {
    await db.query('DELETE FROM cat_etiquetas WHERE id = $1', [req.params.id]);
    res.json({ mensaje: 'Etiqueta eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCiteConfig, updateCiteConfig, getEtiquetas, createEtiqueta, deleteEtiqueta };
