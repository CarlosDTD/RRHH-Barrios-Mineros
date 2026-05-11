const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const PersonalModel = require('../models/personalModel');
const ExcelService = require('../services/excelService');
const ImportService = require('../services/importService');
const db = require('../config/db');

const getAllPersonal = async (req, res) => {
  try {
    const filters = req.query;
    const personal = await PersonalModel.getAll(filters);
    res.json(personal);
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
    res.json({ expediciones, profesiones });
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
  upload
};
