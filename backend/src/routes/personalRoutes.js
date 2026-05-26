const express = require('express');
const router = express.Router();
const personalController = require('../controllers/personalController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', personalController.getAllPersonal);
router.get('/export', checkRole('ADMIN', 'JEFE_RRHH'), personalController.exportPersonal);
router.post('/import', checkRole('ADMIN'), personalController.upload.single('file'), personalController.importPersonal);
router.get('/catalogos', personalController.getCatalogos);
router.get('/contratos-alertas', checkRole('ADMIN', 'JEFE_RRHH'), personalController.getContratosPorVencer);
router.post('/auto-inactivar', checkRole('ADMIN'), personalController.autoInactivarVencidos);
router.post('/', checkRole('ADMIN', 'JEFE_RRHH'), personalController.createPersonal);
router.put('/:id', checkRole('ADMIN', 'JEFE_RRHH'), personalController.updatePersonal);
router.get('/:id/historial', personalController.getHistorial);

module.exports = router;
