const Tarifa = require("../models/tarifa");

exports.registrarTarifa = async (req, res) => {
  try {
    const { tipoVehiculo, precioHora, precioDia } = req.body;

    if (!tipoVehiculo || precioHora == null || precioDia == null) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }
    if (precioHora < 0 || precioDia < 0) {
      return res.status(400).json({ mensaje: "Los precios no pueden ser negativos" });
    }

    const existe = await Tarifa.findOne({ tipoVehiculo });
    if (existe) {
      return res.status(400).json({ mensaje: "Ya existe una tarifa para ese tipo de vehículo" });
    }

    const nuevaTarifa = new Tarifa({ tipoVehiculo, precioHora, precioDia });
    await nuevaTarifa.save();
    res.status(201).json({ mensaje: "Tarifa registrada", tarifa: nuevaTarifa });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al registrar tarifa", error });
  }
};

exports.listarTarifas = async (req, res) => {
  try {
    const tarifas = await Tarifa.find().sort({ tipoVehiculo: 1 });
    res.json(tarifas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar tarifas", error });
  }
};

exports.actualizarTarifa = async (req, res) => {
  try {
    const { tipoVehiculo, precioHora, precioDia } = req.body;

    if (!tipoVehiculo || precioHora == null || precioDia == null) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }
    if (precioHora < 0 || precioDia < 0) {
      return res.status(400).json({ mensaje: "Los precios no pueden ser negativos" });
    }

    const duplicado = await Tarifa.findOne({ tipoVehiculo, _id: { $ne: req.params.id } });
    if (duplicado) {
      return res.status(400).json({ mensaje: "Ya existe otra tarifa con ese tipo de vehículo" });
    }

    const tarifa = await Tarifa.findByIdAndUpdate(
      req.params.id,
      { tipoVehiculo, precioHora, precioDia },
      { new: true, runValidators: true }
    );
    if (!tarifa) return res.status(404).json({ mensaje: "Tarifa no encontrada" });

    res.json({ mensaje: "Tarifa actualizada", tarifa });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar tarifa", error });
  }
};

exports.eliminarTarifa = async (req, res) => {
  try {
    const tarifa = await Tarifa.findByIdAndDelete(req.params.id);
    if (!tarifa) return res.status(404).json({ mensaje: "Tarifa no encontrada" });
    res.json({ mensaje: "Tarifa eliminada" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar tarifa", error });
  }
};
