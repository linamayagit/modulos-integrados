const Contabilidad = require("../models/contabilidad");

// Registrar movimiento
exports.registrarMovimiento = async (req, res) => {
  try {
    const { tipo, monto, descripcion, responsable } = req.body;
    const nuevoMovimiento = new Contabilidad({ tipo, monto, descripcion, responsable });
    await nuevoMovimiento.save();
    res.status(201).json({ mensaje: "Movimiento registrado", movimiento: nuevoMovimiento });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al registrar movimiento", error });
  }
};

// Listar movimientos
exports.listarMovimientos = async (req, res) => {
  try {
    const movimientos = await Contabilidad.find();
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar movimientos", error });
  }
};

// Eliminar movimiento
exports.eliminarMovimiento = async (req, res) => {
  try {
    await Contabilidad.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Movimiento eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar movimiento", error });
  }
};
