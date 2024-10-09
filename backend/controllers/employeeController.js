const employeeModel = require('../models/employeeModel');
const airtableService = require('../services/airtableService');

const obtenerEmpleados = async (req, res, next) => {
  try {
    const empleados = await airtableService.obtenerRegistros(process.env.AIRTABLE_TABLE_NAME_EMPLEADOS);
    res.json(empleados);
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ message: 'Error al obtener empleados', error: error.message });
  }
};

const obtenerEmpleadoPorId = async (req, res, next) => {
  try {
    const empleado = await employeeModel.obtenerEmpleadoPorId(req.params.id);
    if (!empleado) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }
    res.json(empleado);
  } catch (error) {
    next(error);
  }
};

const crearEmpleado = async (req, res, next) => {
  try {
    const nuevoEmpleado = await employeeModel.crearEmpleado(req.body);
    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    next(error);
  }
};

const actualizarEmpleado = async (req, res, next) => {
  try {
    const empleadoActualizado = await employeeModel.actualizarEmpleado(req.params.id, req.body);
    if (!empleadoActualizado) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }
    res.json(empleadoActualizado);
  } catch (error) {
    next(error);
  }
};

const eliminarEmpleado = async (req, res, next) => {
  try {
    await employeeModel.eliminarEmpleado(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerEmpleados,
  obtenerEmpleadoPorId,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado
};