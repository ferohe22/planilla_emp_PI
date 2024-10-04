const airtableService = require('../services/airtableService');

const obtenerEmpleados = async () => {
  return await airtableService.obtenerRegistros(airtableService.tablaEmpleados);
};

const obtenerEmpleadoPorId = async (id) => {
  const empleados = await obtenerEmpleados();
  return empleados.find(empleado => empleado.id === id);
};

const crearEmpleado = async (datosEmpleado) => {
  return await airtableService.crearRegistro(airtableService.tablaEmpleados, datosEmpleado);
};

const actualizarEmpleado = async (id, datosEmpleado) => {
  return await airtableService.actualizarRegistro(airtableService.tablaEmpleados, id, datosEmpleado);
};

const eliminarEmpleado = async (id) => {
  await airtableService.eliminarRegistro(airtableService.tablaEmpleados, id);
};

module.exports = {
  obtenerEmpleados,
  obtenerEmpleadoPorId,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado
};


