const express = require('express');
const router = express.Router();
const FondosController = require('../controllers/FondosController');

router.get('/', FondosController.obtenerFondos);
router.get('/:id', FondosController.obtenerFondosPorId);
router.post('/', FondosController.crearFondos);
router.put('/:id', FondosController.actualizarFondos);
router.delete('/:id', FondosController.eliminarFondos);

module.exports = router;
