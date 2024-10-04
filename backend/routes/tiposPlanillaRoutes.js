const express = require('express');
const router = express.Router();

// Importar el controlador (lo crearemos después)
const tiposPlanillaController = require('../controllers/tiposPlanillaController');

// Definir la ruta para obtener todos los tipos de planilla
router.get('/', tiposPlanillaController.getAllTiposPlanilla);

module.exports = router;