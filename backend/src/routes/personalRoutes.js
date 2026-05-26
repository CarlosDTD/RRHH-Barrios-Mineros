const express = require('express');
const router = express.Router();
const personalController = require('../controllers/personalController');

router.get('/', personalController.getAllPersonal);
router.post('/', personalController.createPersonal);
router.put('/:id', personalController.updatePersonal);
router.get('/:id/historial', personalController.getHistorial);
router.get('/export', personalController.exportPersonal);
router.post('/import', personalController.upload.single('file'), personalController.importPersonal);
router.get('/catalogos', personalController.getCatalogos);
router.get('/contratos-alertas', personalController.getContratosPorVencer);
router.post('/auto-inactivar', personalController.autoInactivarVencidos);

module.exports = router;
