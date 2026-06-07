const Tarifa = require("../models/tarifa");

// Registrar tarifa
exports.registrarTarifa = async (req, res) => {
  try {
    const { tipoVehiculo, precioHora, precioDia } = req.body;
    const nuevaTarifa = new Tarifa({ tipoVehiculo, precioHora, precioDia });
    await nuevaTarifa.save();
    res.status(201).json({ mensaje: "Tarifa registrada", tarifa: nuevaTarifa });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al registrar tarifa", error });
  }
};

// Listar tarifas
exports.listarTarifas = async (req, res) => {
  try {
    const tarifas = await Tarifa.find();
    res.json(tarifas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar tarifas", error });
  }
};

// Eliminar tarifa
exports.eliminarTarifa = async (req, res) => {
  try {
    await Tarifa.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Tarifa eliminada" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar tarifa", error });
  }
};
