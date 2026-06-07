const Vehiculo = require("../models/vehiculo");

// Registrar vehículo
exports.registrarVehiculo = async (req, res) => {
  try {
    const { placa, tipo, color, propietario, horaEntrada } = req.body;

    const nuevoVehiculo = new Vehiculo({
      placa,
      tipo,
      color,
      propietario,
      horaEntrada
    });

    await nuevoVehiculo.save();
    res.status(201).json({ mensaje: "Vehículo registrado correctamente", vehiculo: nuevoVehiculo });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al registrar vehículo", error });
  }
};

// Listar vehículos
exports.listarVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.find();
    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener vehículos", error });
  }
};

// Eliminar vehículo
exports.eliminarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    await Vehiculo.findByIdAndDelete(id);
    res.json({ mensaje: "Vehículo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar vehículo", error });
  }
};
