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
}, async (req, res) => {
    try {
        await planillaMensualController.crearPlanillaMensual(req, res);
    } catch (error) {
        console.error('Error al crear planilla mensual:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear planilla mensual' });
    }
});

// Nueva ruta para generar el reporte de empleados
router.post('/reporte', (req, res, next) => {
    console.log('Solicitud POST recibida en /reporte');
    console.log('Cuerpo de la solicitud:', req.body);
    next();
}, planillaMensualController.generarReporteEmpleados);

router.get('/test', (req, res) => {
    console.log('Ruta de prueba accedida');
    res.json({ 
        message: 'Ruta de prueba funcionando',
        timestamp: new Date().toISOString(),
        route: '/api/planilla-mensual/test'
    });
});

// Nueva ruta para eliminar planilla mensual
router.delete('/eliminar', (req, res, next) => {
    console.log('Solicitud DELETE recibida en /eliminar');
    console.log('Cuerpo de la solicitud:', req.body);
    next();
}, planillaMensualController.EliminarPlanillaMensual);

// Nueva ruta para cerrar planilla mensual
router.post('/cerrar', (req, res, next) => {
    console.log('Solicitud POST recibida en /cerrar');
    console.log('Cuerpo de la solicitud:', req.body);
    next();
}, planillaMensualController.CerrarPlanillaMensual);

module.exports = router;