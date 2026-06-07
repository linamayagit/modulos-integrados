const Registro = require("../models/registro");

// Registrar entrada
exports.registrarEntrada = async (req, res) => {
  try {
    const { vehiculo, horaEntrada, observaciones } = req.body;
    const nuevoRegistro = new Registro({ vehiculo, horaEntrada, observaciones });
    await nuevoRegistro.save();
    res.status(201).json({ mensaje: "Entrada registrada", registro: nuevoRegistro });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al registrar entrada", error });
  }
};

// Registrar salida
exports.registrarSalida = async (req, res) => {
  try {
    const { id } = req.params;
    const registro = await Registro.findById(id);
    if (!registro) return res.status(404).json({ mensaje: "Registro no encontrado" });

    registro.horaSalida = new Date();
    await registro.save();
    res.json({ mensaje: "Salida registrada", registro });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar salida", error });
  }
};

// Listar registros
exports.listarRegistros = async (req, res) => {
  try {
    const registros = await Registro.find().populate("vehiculo");
    res.json(registros);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar registros", error });
  }
};

// Eliminar registro
exports.eliminarRegistro = async (req, res) => {
  try {
    await Registro.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Registro eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar registro", error });
  }
};
