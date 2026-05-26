const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const PersonalModel = require('../models/personalModel');
const ExcelService = require('../services/excelService');
const ImportService = require('../services/importService');
const db = require('../config/db');

const getAllPersonal = async (req, res) => {
  try {
    const { nombre, ci, item, fuentes, sort, order, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    // fuentes puede venir como string separado por comas si se envía desde query params
    const fuentesArray = fuentes ? (Array.isArray(fuentes) ? fuentes : fuentes.split(',')) : [];

    const personal = await PersonalModel.getAll({ 
      nombre, 
      ci, 
      item,
      fuentes: fuentesArray,
      sort,
      order,
      limit: parseInt(limit), 
      offset: parseInt(offset) 
    });

    const totalCount = personal.length > 0 ? parseInt(personal[0].total_count) : 0;
    
    res.json({
      data: personal,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPersonal = async (req, res) => {
  try {
    const newPersonal = await PersonalModel.create(req.body);
    res.status(201).json(newPersonal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePersonal = async (req, res) => {
  try {
    const updated = await PersonalModel.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const exportPersonal = async (req, res) => {
  try {
    const personal = await PersonalModel.getAll(req.query);
    const buffer = await ExcelService.exportPersonalToExcel(personal);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=personal.xlsx');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const importPersonal = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });
    const results = await ImportService.importPersonalFromExcel(req.file.buffer);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCatalogos = async (req, res) => {
  try {
    const { rows: expediciones } = await db.query('SELECT * FROM cat_expediciones ORDER BY sigla');
    const { rows: profesiones } = await db.query('SELECT * FROM cat_profesiones ORDER BY nombre_profesion');
    const { rows: fuentes } = await db.query('SELECT * FROM cat_fuentes_financiamiento ORDER BY nombre_fuente');
    const { rows: tipos } = await db.query('SELECT * FROM cat_tipos_personal ORDER BY nombre_tipo');
    const { rows: establecimientos } = await db.query('SELECT * FROM establecimientos ORDER BY nombre_establecimiento');
    const { rows: unidades_servicios } = await db.query('SELECT * FROM cat_unidades_servicios ORDER BY nombre_unidad');
    
    res.json({ expediciones, profesiones, fuentes, tipos, establecimientos, unidades_servicios });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHistorial = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`
      SELECT * FROM historial_movimientos 
      WHERE personal_id = $1 
      ORDER BY fecha_movimiento DESC, id DESC
    `, [id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getContratosPorVencer = async (req, res) => {
  try {
    const vencidos = await db.query(`
      SELECT p.id, p.primer_nombre, p.apellido_paterno, vl.fecha_fin_contrato
      FROM vinculos_laborales vl
      JOIN personal p ON vl.personal_id = p.id
      WHERE vl.fecha_fin_contrato < CURRENT_DATE
      ORDER BY vl.fecha_fin_contrato ASC
    `);

    const porVencer = await db.query(`
      SELECT p.id, p.primer_nombre, p.apellido_paterno, vl.fecha_fin_contrato
      FROM vinculos_laborales vl
      JOIN personal p ON vl.personal_id = p.id
      WHERE vl.fecha_fin_contrato BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
      ORDER BY vl.fecha_fin_contrato ASC
    `);

    const activos = await db.query(`SELECT COUNT(*) as count FROM personal WHERE activo = true`);
    const inactivos = await db.query(`SELECT COUNT(*) as count FROM personal WHERE activo = false`);

    res.json({
      vencidos: vencidos.rows,
      porVencer: porVencer.rows,
      stats: {
        vencidosCount: vencidos.rows.length,
        porVencerCount: porVencer.rows.length,
        activos: parseInt(activos.rows[0].count),
        inactivos: parseInt(inactivos.rows[0].count)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const autoInactivarVencidos = async (req, res) => {
  try {
    const { rowCount } = await db.query(`
      UPDATE personal 
      SET activo = false 
      WHERE id IN (
        SELECT vl.personal_id 
        FROM vinculos_laborales vl 
        WHERE vl.fecha_fin_contrato < CURRENT_DATE
      )
    `);
    res.json({ message: `${rowCount} registros desactivados` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPersonal,
  createPersonal,
  updatePersonal,
  exportPersonal,
  importPersonal,
  getCatalogos,
  getHistorial,
  getContratosPorVencer,
  autoInactivarVencidos,
  upload
};
