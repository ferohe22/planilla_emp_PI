const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/', employeeController.obtenerEmpleados);
router.get('/:id', employeeController.obtenerEmpleadoPorId);
router.post('/', employeeController.crearEmpleado);
router.put('/:id', employeeController.actualizarEmpleado);
router.delete('/:id', employeeController.eliminarEmpleado);

module.exports = router;