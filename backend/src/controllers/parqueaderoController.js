const Parqueadero = require("../models/parqueadero");

// Registrar parqueadero
exports.registrarParqueadero = async (req, res) => {
  try {
    const { nombre, direccion, capacidad } = req.body;
    const nuevo = new Parqueadero({ nombre, direccion, capacidad });
    await nuevo.save();
    res.status(201).json({ mensaje: "Parqueadero registrado", parqueadero: nuevo });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al registrar", error });
  }
};

// Listar parqueaderos
exports.listarParqueaderos = async (req, res) => {
  try {
    const lista = await Parqueadero.find();
    res.json(lista);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar", error });
  }
};

// Eliminar parqueadero
exports.eliminarParqueadero = async (req, res) => {
  try {
    await Parqueadero.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Parqueadero eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar", error });
  }
};
