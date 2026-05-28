const TurnoModel = require('../models/turnoModel');
const TurnoService = require('../services/turnoService');
const db = require('../config/db');
const { PDFDocument } = require('pdf-lib');

const getServicios = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM cat_unidades_servicios ORDER BY nombre_unidad');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTiposTurno = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM cat_tipos_turno ORDER BY id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRolesByServicio = async (req, res) => {
  try {
    const rows = await TurnoModel.getRolesByServicio(req.params.servicioId);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRol = async (req, res) => {
  try {
    const rol = await TurnoModel.createRol(req.body);
    res.status(201).json(rol);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRol = async (req, res) => {
  try {
    const rol = await TurnoModel.updateRol(req.params.id, req.body);
    if (!rol) return res.status(404).json({ error: 'Rol no encontrado' });
    res.json(rol);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRol = async (req, res) => {
  try {
    const rol = await TurnoModel.deleteRol(req.params.id);
    if (!rol) return res.status(404).json({ error: 'Rol no encontrado' });
    res.json({ mensaje: 'Rol eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPersonalByRol = async (req, res) => {
  try {
    const rows = await TurnoModel.getPersonalByRol(req.params.rolTurnoId);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assignPersonal = async (req, res) => {
  try {
    const item = await TurnoModel.assignPersonal(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removePersonal = async (req, res) => {
  try {
    const item = await TurnoModel.removePersonal(req.params.id);
    if (!item) return res.status(404).json({ error: 'Asignación no encontrada' });
    res.json({ mensaje: 'Personal desasignado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPlanilla = async (req, res) => {
  try {
    const { servicio_id, fecha_desde, fecha_hasta, mes, anio } = req.query;
    const rows = await TurnoModel.getPlanilla({
      servicio_id, fecha_desde, fecha_hasta, mes, anio
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPlanillaItem = async (req, res) => {
  try {
    const item = await TurnoModel.createPlanillaItem({
      ...req.body,
      created_by: req.usuario.id
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePlanillaItem = async (req, res) => {
  try {
    const item = await TurnoModel.updatePlanillaItem(req.params.id, {
      ...req.body,
      updated_by: req.usuario.id
    });
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePlanillaItem = async (req, res) => {
  try {
    const item = await TurnoModel.deletePlanillaItem(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });
    res.json({ mensaje: 'Item eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generarAuto = async (req, res) => {
  try {
    const { servicio_id, mes, anio } = req.body;
    const resultados = await TurnoService.generarPlanillaAuto(
      servicio_id, mes, anio, req.usuario.id
    );
    res.json({ creados: resultados.length, items: resultados });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sugerirPersonal = async (req, res) => {
  try {
    const { rol_turno_id, fecha } = req.query;
    const rows = await TurnoModel.sugerirPersonal(rol_turno_id, fecha);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJefesServicio = async (req, res) => {
  try {
    const rows = await TurnoModel.getJefesServicio();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assignJefe = async (req, res) => {
  try {
    const { usuario_id, servicio_id } = req.body;
    const item = await TurnoModel.assignJefe(usuario_id, servicio_id);
    if (!item) return res.status(409).json({ error: 'Ya asignado' });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeJefe = async (req, res) => {
  try {
    const item = await TurnoModel.removeJefe(req.params.id);
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Jefe removido' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const detectarPosiblesJefes = async (req, res) => {
  try {
    const rows = await TurnoModel.detectarPosiblesJefes();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const exportPlanilla = async (req, res) => {
  try {
    const { servicio_id, mes, anio, formato } = req.query;
    if (formato === 'pdf') {
      const pdfBytes = await TurnoService.exportToPDF(servicio_id, mes, anio);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=planilla_${mes}_${anio}.pdf`);
      res.send(Buffer.from(pdfBytes));
    } else {
      const buffer = await TurnoService.exportToExcel(servicio_id, mes, anio);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=planilla_${mes}_${anio}.xlsx`);
      res.send(buffer);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPersonalDisponible = async (req, res) => {
  try {
    const { servicio_id, q } = req.query;
    let query = `
      SELECT p.id, p.ci,
             CONCAT(p.primer_nombre, ' ', p.apellido_paterno) as nombre_completo,
             vl.cargo_actual, ff.nombre_fuente, tp.nombre_tipo
      FROM personal p
      JOIN vinculos_laborales vl ON p.id = vl.personal_id
      LEFT JOIN cat_fuentes_financiamiento ff ON vl.fuente_financiamiento_id = ff.id
      LEFT JOIN cat_tipos_personal tp ON vl.tipo_personal_id = tp.id
      WHERE p.estado = 'ACTIVO'
    `;
    const params = [];
    let idx = 1;

    if (servicio_id) {
      query += ` AND (vl.unidad_servicio_id = $${idx}
        OR EXISTS (SELECT 1 FROM cat_unidades_servicios WHERE id = $${idx}
          AND TRIM(vl.unidad_servicio) ILIKE '%' || nombre_unidad || '%'))`;
      params.push(servicio_id);
      idx++;
    }

    if (q) {
      query += ` AND (p.ci ILIKE $${idx} OR p.primer_nombre ILIKE $${idx} OR p.apellido_paterno ILIKE $${idx})`;
      params.push(`%${q}%`);
      idx++;
    }

    query += ` ORDER BY ff.nombre_fuente ASC, p.apellido_paterno ASC LIMIT 100`;
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getServicios,
  getTiposTurno,
  getRolesByServicio,
  createRol,
  updateRol,
  deleteRol,
  getPersonalByRol,
  assignPersonal,
  removePersonal,
  getPlanilla,
  createPlanillaItem,
  updatePlanillaItem,
  deletePlanillaItem,
  generarAuto,
  sugerirPersonal,
  getJefesServicio,
  assignJefe,
  removeJefe,
  detectarPosiblesJefes,
  exportPlanilla,
  getPersonalDisponible
};
