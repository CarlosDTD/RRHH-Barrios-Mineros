const express = require('express');
const router = express.Router();
const personalController = require('../controllers/personalController');

router.get('/', personalController.getAllPersonal);
router.post('/', personalController.createPersonal);
router.put('/:id', personalController.updatePersonal);
router.get('/export', personalController.exportPersonal);
router.post('/import', personalController.upload.single('file'), personalController.importPersonal);
router.get('/catalogos', personalController.getCatalogos);

module.exports = router;
