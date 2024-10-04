const express = require('express');
const router = express.Router();
const planillaMensualController = require('../controllers/planillaMensualController');

// Log para verificar que se está accediendo a este archivo de rutas
console.log('Archivo de rutas de planilla mensual cargado');

// Ruta para crear una nueva planilla mensual
router.post('/crear', (req, res, next) => {
    console.log('Solicitud POST recibida en /crear');
    //console.log('Cuerpo de la solicitud:', req.body);
    next();
}, planillaMensualController.crearPlanillaMensual);

// Nueva ruta para generar el reporte de empleados
router.post('/reporte', (req, res, next) => {
    console.log('Solicitud POST recibida en /reporte');
    console.log('Cuerpo de la solicitud:', req.body);
    next();
}, planillaMensualController.generarReporteEmpleados);

router.get('/test', (req, res) => {
    console.log('Ruta de prueba accedida');
    res.json({ message: 'Ruta de prueba funcionando' });
});
  
module.exports = router;