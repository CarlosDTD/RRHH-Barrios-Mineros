const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', checkRole('ADMIN'), usuarioController.getAll);
router.post('/', checkRole('ADMIN'), usuarioController.createUser);
router.get('/roles', checkRole('ADMIN'), usuarioController.getRoles);
router.get('/permisos', checkRole('ADMIN'), usuarioController.getPermisos);
router.put('/:id/roles', checkRole('ADMIN'), usuarioController.updateRoles);
router.put('/:id/toggle-activo', checkRole('ADMIN'), usuarioController.toggleActivo);
router.post('/:id/reset-password', checkRole('ADMIN'), usuarioController.resetPassword);

module.exports = router;
