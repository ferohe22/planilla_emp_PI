const FondosModel = require('../models/FondosModel');

const obtenerFondos = async (req, res, next) => {
  try {
    const Fondos = await FondosModel.obtenerFondos();
    res.json(Fondos);
  } catch (error) {
    next(error);
  }
};

const obtenerFondosPorId = async (req, res, next) => {
  try {
    const Fondos = await FondosModel.obtenerFondosPorId(req.params.id);
    if (!Fondos) {
      return res.status(404).json({ mensaje: 'Nómina no encontrada' });
    }
    res.json(Fondos);
  } catch (error) {
    next(error);
  }
};

const crearFondos = async (req, res, next) => {
  try {
    const nuevaFondos = await FondosModel.crearFondos(req.body);
    res.status(201).json(nuevaFondos);
  } catch (error) {
    next(error);
  }
};

const actualizarFondos = async (req, res, next) => {
  try {
    const FondosActualizada = await FondosModel.actualizarFondos(req.params.id, req.body);
    if (!FondosActualizada) {
      return res.status(404).json({ mensaje: 'Nómina no encontrada' });
    }
    res.json(FondosActualizada);
  } catch (error) {
    next(error);
  }
};

const eliminarFondos = async (req, res, next) => {
  try {
    await FondosModel.eliminarFondos(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerFondos,
  obtenerFondosPorId,
  crearFondos,
  actualizarFondos,
  eliminarFondos
};