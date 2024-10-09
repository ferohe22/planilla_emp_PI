const airtableService = require('../services/airtableService');

const obtenerFondos = async () => {
  return await airtableService.obtenerRegistros(airtableService.tablaFondos);
};

const obtenerFondosPorId = async (id) => {
  const fondos = await obtenerFondos();
  return fondos.find(fondo => fondo.id === id);
};

const crearFondos = async (datosFondos) => {
  return await airtableService.crearRegistro(airtableService.tablaFondos, datosFondos);
};

const actualizarFondos = async (id, datosFondos) => {
  return await airtableService.actualizarRegistro(airtableService.tablaFondos, id, datosFondos);
};

const eliminarFondos = async (id) => {
  await airtableService.eliminarRegistro(airtableService.tablaFondos, id);
};

module.exports = {
  obtenerFondos,
  obtenerFondosPorId,
  crearFondos,
  actualizarFondos,
  eliminarFondos
};
