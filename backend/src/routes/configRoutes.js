const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/cite', configController.getCiteConfig);
router.put('/cite', checkRole('ADMIN'), configController.updateCiteConfig);

router.get('/etiquetas', configController.getEtiquetas);
router.post('/etiquetas', checkRole('ADMIN'), configController.createEtiqueta);
router.delete('/etiquetas/:id', checkRole('ADMIN'), configController.deleteEtiqueta);

module.exports = router;
