const express = require('express');
const router = express.Router();
const ReporteController = require('../controllers/reporteController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/inventario', checkRole('ADMIN', 'JEFE_RRHH', 'DIRECTOR', 'SECRETARIO'), ReporteController.getInventarioPersonal);
router.get('/contratos-vencer', checkRole('ADMIN', 'JEFE_RRHH', 'DIRECTOR', 'SECRETARIO'), ReporteController.getContratosPorVencer);
router.get('/config', checkRole('ADMIN', 'JEFE_RRHH', 'DIRECTOR', 'SECRETARIO'), ReporteController.getReportesConfig);

module.exports = router;
