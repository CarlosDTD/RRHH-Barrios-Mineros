const express = require('express');
const router = express.Router();
const correspondenciaController = require('../controllers/correspondenciaController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/catalogos', correspondenciaController.getCatalogos);
router.get('/estadisticas', correspondenciaController.getEstadisticas);
router.get('/bandeja', correspondenciaController.getBandeja);

router.get('/', correspondenciaController.getAll);
router.get('/:id', correspondenciaController.getById);

router.post('/',
  checkRole('ADMIN', 'SECRETARIO'),
  correspondenciaController.upload.single('pdf'),
  correspondenciaController.create
);

router.put('/:id',
  checkRole('ADMIN', 'SECRETARIO'),
  correspondenciaController.upload.single('pdf'),
  correspondenciaController.update
);

router.post('/:id/derivar',
  checkRole('ADMIN', 'SECRETARIO', 'DIRECTOR', 'JEFE_RRHH', 'AUXILIAR'),
  correspondenciaController.derivar
);

router.put('/derivaciones/:derivacionId/responder',
  checkRole('ADMIN', 'SECRETARIO', 'DIRECTOR', 'JEFE_RRHH', 'AUXILIAR'),
  correspondenciaController.responder
);

module.exports = router;
