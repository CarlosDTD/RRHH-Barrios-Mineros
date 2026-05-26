const CorrespondenciaModel = require('../models/correspondenciaModel');
const PdfService = require('../services/pdfService');
const multer = require('multer');
const db = require('../config/db');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'), false);
    }
  }
});

const getAll = async (req, res) => {
  try {
    const { estado, tipo_id, clasificacion_id, busqueda, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const data = await CorrespondenciaModel.getAll({
      estado, tipo_id, clasificacion_id, busqueda,
      limit: parseInt(limit), offset: parseInt(offset)
    });

    const totalCount = data.length > 0 ? parseInt(data[0].total_count) : 0;

    res.json({
      data,
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

const getById = async (req, res) => {
  try {
    const data = await CorrespondenciaModel.getById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Correspondencia no encontrada' });

    const derivaciones = await CorrespondenciaModel.getDerivaciones(req.params.id);
    res.json({ ...data, derivaciones });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = { ...req.body, usuario_recepcion_id: req.usuario.id };

    if (req.file) {
      const paths = await PdfService.saveFiles(
        'temp', data.gestion || 2026, req.file.buffer
      );
      data.pdf_original = paths.pdf_original;
      data.pdf_comprimido = paths.pdf_comprimido;
    }

    if (data.etiquetas && typeof data.etiquetas === 'string') {
      data.etiquetas = JSON.parse(data.etiquetas);
    }

    const result = await CorrespondenciaModel.create(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      const paths = await PdfService.saveFiles(
        req.params.id, data.gestion || 2026, req.file.buffer
      );
      data.pdf_original = paths.pdf_original;
      data.pdf_comprimido = paths.pdf_comprimido;
    }

    if (data.etiquetas && typeof data.etiquetas === 'string') {
      data.etiquetas = JSON.parse(data.etiquetas);
    }

    const result = await CorrespondenciaModel.update(req.params.id, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const derivar = async (req, res) => {
  try {
    const { para_usuario_id, instruccion } = req.body;
    if (!para_usuario_id) {
      return res.status(400).json({ error: 'Usuario destino requerido' });
    }

    const result = await CorrespondenciaModel.derivar(
      req.params.id, req.usuario.id, para_usuario_id, instruccion
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const responder = async (req, res) => {
  try {
    const { respuesta } = req.body;
    if (!respuesta) {
      return res.status(400).json({ error: 'Respuesta requerida' });
    }

    const result = await CorrespondenciaModel.responder(
      req.params.derivacionId, req.usuario.id, respuesta
    );

    if (!result) {
      return res.status(404).json({ error: 'Derivación no encontrada o no autorizada' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBandeja = async (req, res) => {
  try {
    const data = await CorrespondenciaModel.getBandeja(req.usuario.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCatalogos = async (req, res) => {
  try {
    const { rows: tipos } = await db.query('SELECT * FROM cat_tipos_correspondencia ORDER BY id');
    const { rows: clasificaciones } = await db.query('SELECT * FROM cat_clasificaciones ORDER BY codigo');
    const { rows: etiquetas } = await db.query('SELECT * FROM cat_etiquetas ORDER BY nombre');
    const { rows: usuarios } = await db.query(`
      SELECT u.id, u.username, p.ci,
             CONCAT(p.primer_nombre, ' ', p.apellido_paterno) as nombre_completo,
             vl.cargo_actual
      FROM usuarios u
      JOIN personal p ON u.personal_id = p.id
      LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id
      WHERE u.activo = true
      ORDER BY p.primer_nombre
    `);
    res.json({ tipos, clasificaciones, etiquetas, usuarios });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEstadisticas = async (req, res) => {
  try {
    const stats = await CorrespondenciaModel.getEstadisticas();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll, getById, create, update, derivar, responder,
  getBandeja, getCatalogos, getEstadisticas, upload
};
