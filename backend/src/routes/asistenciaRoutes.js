const express = require('express');
const router = express.Router();
const multer = require('multer');
const AsistenciaController = require('../controllers/asistenciaController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);

router.post('/import', checkRole('ADMIN'), upload.single('archivo'), AsistenciaController.importAsistencia);
router.get('/', AsistenciaController.getAsistencias);
router.delete('/:id', checkRole('ADMIN'), AsistenciaController.deleteAsistencia);

module.exports = router;
