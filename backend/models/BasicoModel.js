const airtableService = require('../services/airtableService');

const obtenerBasicos = async () => {
  return await airtableService.obtenerRegistros(airtableService.tablaBasico);
};

const obtenerBasicoPorId = async (id) => {
  const Basicos = await obtenerBasicos();
  return Basicos.find(Basico => Basico.id === id);
};

const crearBasico = async (datosBasico) => {
  return await airtableService.crearRegistro(airtableService.tablaBasico, datosBasico);
};

const actualizarBasico = async (id, datosBasico) => {
  return await airtableService.actualizarRegistro(airtableService.tablaBasico, id, datosBasico);
};

const eliminarBasico = async (id) => {
  await airtableService.eliminarRegistro(airtableService.tablaBasico, id);
};

module.exports = {
  obtenerBasicos,
  obtenerBasicoPorId,
  crearBasico,
  actualizarBasico,
  eliminarBasico
};