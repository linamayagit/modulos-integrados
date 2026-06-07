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

// Listar vehículos (con paginación y filtros)
exports.listarVehiculos = async (req, res) => {
  try {
    const { page = 1, limit = 20, placa, tipo, propietario } = req.query;

    const filter = {};
    if (placa) filter.placa = { $regex: placa, $options: "i" };
    if (tipo) filter.tipo = tipo;
    if (propietario) filter.propietario = { $regex: propietario, $options: "i" };

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
    };

    const result = await Vehiculo.paginate(filter, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener vehículos", error });
  }
};

// Actualizar vehículo
exports.actualizarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const vehiculoActualizado = await Vehiculo.findByIdAndUpdate(id, req.body, { new: true });
    if (!vehiculoActualizado) {
      return res.status(404).json({ mensaje: "Vehículo no encontrado" });
    }
    res.json({ mensaje: "Vehículo actualizado", vehiculo: vehiculoActualizado });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar vehículo", error });
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
