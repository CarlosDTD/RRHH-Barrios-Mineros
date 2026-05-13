const express = require('express');
const router = express.Router();
const multer = require('multer');
const AsistenciaController = require('../controllers/asistenciaController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/import', upload.single('archivo'), AsistenciaController.importAsistencia);
router.get('/', AsistenciaController.getAsistencias);
router.delete('/:id', AsistenciaController.deleteAsistencia);

module.exports = router;
