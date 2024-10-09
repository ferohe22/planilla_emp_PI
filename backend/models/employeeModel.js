const airtableService = require('../services/airtableService');

const obtenerEmpleados = async () => {
  try {
    return await airtableService.obtenerRegistros('Empleados');
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    throw error;
  }
};

const obtenerEmpleadoPorId = async (id) => {
  try {
    const empleados = await obtenerEmpleados();
    return empleados.find(empleado => empleado.id === id);
  } catch (error) {
    console.error('Error al obtener empleado por ID:', error);
    throw error;
  }
};

const crearEmpleado = async (datosEmpleado) => {
  try {
    return await airtableService.crearRegistro('Empleados', datosEmpleado);
  } catch (error) {
    console.error('Error al crear empleado:', error);
    throw error;
  }
};

const actualizarEmpleado = async (id, datosEmpleado) => {
  try {
    return await airtableService.actualizarRegistro('Empleados', id, datosEmpleado);
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    throw error;
  }
};

const eliminarEmpleado = async (id) => {
  try {
    await airtableService.eliminarRegistro('Empleados', id);
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    throw error;
  }
};

module.exports = {
  obtenerEmpleados,
  obtenerEmpleadoPorId,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado
};


