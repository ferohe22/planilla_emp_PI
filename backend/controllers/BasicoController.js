const BasicoModel = require('../models/BasicoModel');

const obtenerBasicos = async (req, res, next) => {
  try {
    const Basicos = await BasicoModel.obtenerBasicos();
    res.json(Basicos);
  } catch (error) {
    next(error);
  }
};

const obtenerBasicoPorId = async (req, res, next) => {
  try {
    const Basico = await BasicoModel.obtenerBasicoPorId(req.params.id);
    if (!Basico) {
      return res.status(404).json({ mensaje: 'Nómina no encontrada' });
    }
    res.json(Basico);
  } catch (error) {
    next(error);
  }
};

const crearBasico = async (req, res, next) => {
  try {
    const nuevaBasico = await BasicoModel.crearBasico(req.body);
    res.status(201).json(nuevaBasico);
  } catch (error) {
    next(error);
  }
};

const actualizarBasico = async (req, res, next) => {
  try {
    const BasicoActualizada = await BasicoModel.actualizarBasico(req.params.id, req.body);
    if (!BasicoActualizada) {
      return res.status(404).json({ mensaje: 'Nómina no encontrada' });
    }
    res.json(BasicoActualizada);
  } catch (error) {
    next(error);
  }
};

const eliminarBasico = async (req, res, next) => {
  try {
    await BasicoModel.eliminarBasico(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerBasicos,
  obtenerBasicoPorId,
  crearBasico,
  actualizarBasico,
  eliminarBasico
};