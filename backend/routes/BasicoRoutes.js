const express = require('express');
const router = express.Router();
const BasicoController = require('../controllers/BasicoController');

router.get('/', BasicoController.obtenerBasicos);
router.get('/:id', BasicoController.obtenerBasicoPorId);
router.post('/', BasicoController.crearBasico);
router.put('/:id', BasicoController.actualizarBasico);
router.delete('/:id', BasicoController.eliminarBasico);

module.exports = router;