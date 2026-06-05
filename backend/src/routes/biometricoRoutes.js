const express = require('express');
const router = express.Router();
const BiometricoController = require('../controllers/biometricoController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.use(checkRole('ADMIN'));

// Configuración
router.get('/config', BiometricoController.getConfig);
router.post('/config', BiometricoController.updateConfig);

// Sincronización en vivo
router.post('/sync-logs', BiometricoController.syncLogs);
router.get('/users', BiometricoController.getUsers);
router.get('/raw-logs', BiometricoController.getRawLogs);

// Importación desde ZKTimeNet.db
router.post('/importar-empleados', BiometricoController.importarEmpleados);
router.post('/importar-marcaciones', BiometricoController.importarMarcaciones);
router.get('/stats-importacion', BiometricoController.getStatsImportacion);

// Departamentos
router.get('/departamentos', BiometricoController.getDepartamentos);

// Mapeo de empleados
router.get('/sugerencias', BiometricoController.getSugerencias);
router.get('/no-vinculados', BiometricoController.getNoVinculados);
router.get('/vinculados', BiometricoController.getVinculados);
router.post('/vincular', BiometricoController.vincular);
router.post('/desvincular', BiometricoController.desvincular);
router.get('/personal-sin-biometrico', BiometricoController.getPersonalSinBiometrico);
router.get('/resumen-mapeo', BiometricoController.getResumenMapeo);

// Asistencia desde biométrico
router.get('/asistencia-mensual', BiometricoController.getAsistenciaMensual);
router.get('/asistencia-personas', BiometricoController.getPersonasConAsistencia);
router.get('/marcaciones/:personalId', BiometricoController.getMarcacionesPorDia);

module.exports = router;
