const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');
const TurnoModel = require('../models/turnoModel');

router.use(authMiddleware);

const checkJefeServicio = async (req, res, next) => {
  try {
    if (req.usuario.roles.includes('ADMIN') || req.usuario.roles.includes('JEFE_RRHH')) {
      return next();
    }
    const servicioId = req.body.servicio_id || req.query.servicio_id || req.params.servicioId;
    if (!servicioId) {
      return res.status(400).json({ error: 'servicio_id requerido' });
    }
    const servicios = await TurnoModel.getJefeServicioIds(req.usuario.id);
    if (!servicios.includes(parseInt(servicioId))) {
      return res.status(403).json({ error: 'No eres jefe de este servicio' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Servicios y tipos de turno (todos autenticados)
router.get('/servicios', turnoController.getServicios);
router.get('/tipos-turno', turnoController.getTiposTurno);

// CRUD roles de turno (ADMIN, JEFE_RRHH, JEFE_SERVICIO de ese servicio)
router.get('/roles-turno/servicio/:servicioId', turnoController.getRolesByServicio);
router.post('/roles-turno', checkRole('ADMIN', 'JEFE_RRHH', 'JEFE_SERVICIO'), checkJefeServicio, turnoController.createRol);
router.put('/roles-turno/:id', checkRole('ADMIN', 'JEFE_RRHH', 'JEFE_SERVICIO'), turnoController.updateRol);
router.delete('/roles-turno/:id', checkRole('ADMIN', 'JEFE_RRHH', 'JEFE_SERVICIO'), turnoController.deleteRol);

// Personal asignado a roles
router.get('/personal-asignado/:rolTurnoId', turnoController.getPersonalByRol);
router.post('/personal-asignado', checkRole('ADMIN', 'JEFE_RRHH', 'JEFE_SERVICIO'), checkJefeServicio, turnoController.assignPersonal);
router.delete('/personal-asignado/:id', checkRole('ADMIN', 'JEFE_RRHH', 'JEFE_SERVICIO'), turnoController.removePersonal);

// Personal disponible para asignar
router.get('/personal-disponible', turnoController.getPersonalDisponible);

// Planilla de turnos
router.get('/planilla', turnoController.getPlanilla);
router.post('/planilla', checkRole('ADMIN', 'JEFE_RRHH', 'JEFE_SERVICIO'), checkJefeServicio, turnoController.createPlanillaItem);
router.put('/planilla/:id', checkRole('ADMIN', 'JEFE_RRHH', 'JEFE_SERVICIO'), turnoController.updatePlanillaItem);
router.delete('/planilla/:id', checkRole('ADMIN', 'JEFE_RRHH', 'JEFE_SERVICIO'), turnoController.deletePlanillaItem);
router.post('/planilla/generar', checkRole('ADMIN', 'JEFE_RRHH', 'JEFE_SERVICIO'), checkJefeServicio, turnoController.generarAuto);
router.get('/planilla/export', checkRole('ADMIN', 'JEFE_RRHH', 'JEFE_SERVICIO'), turnoController.exportPlanilla);

// Sugerir personal para un rol en una fecha
router.get('/sugerir', checkRole('ADMIN', 'JEFE_RRHH', 'JEFE_SERVICIO'), turnoController.sugerirPersonal);

// Jefes de servicio (solo ADMIN y JEFE_RRHH)
router.get('/jefes-servicio', checkRole('ADMIN', 'JEFE_RRHH'), turnoController.getJefesServicio);
router.post('/jefes-servicio', checkRole('ADMIN', 'JEFE_RRHH'), turnoController.assignJefe);
router.delete('/jefes-servicio/:id', checkRole('ADMIN', 'JEFE_RRHH'), turnoController.removeJefe);
router.get('/jefes-servicio/detectar', checkRole('ADMIN', 'JEFE_RRHH'), turnoController.detectarPosiblesJefes);

module.exports = router;
