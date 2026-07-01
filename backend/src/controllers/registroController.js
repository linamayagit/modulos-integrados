const Registro = require("../models/registro");
const Vehiculo = require("../models/vehiculo");

exports.registrarEntrada = async (req, res) => {
  try {
    const { vehiculo, horaEntrada, observaciones } = req.body;

    const vehiculoExiste = await Vehiculo.findById(vehiculo);
    if (!vehiculoExiste) {
      return res.status(404).json({ mensaje: "Vehículo no encontrado" });
    }

    const activo = await Registro.findOne({ vehiculo, horaSalida: null });
    if (activo) {
      return res.status(400).json({ mensaje: "El vehículo ya tiene una entrada activa" });
    }

    const nuevoRegistro = new Registro({
      vehiculo,
      horaEntrada: horaEntrada || Date.now(),
      observaciones,
    });
    await nuevoRegistro.save();

    const registroConPopulate = await Registro.findById(nuevoRegistro._id).populate("vehiculo");
    res.status(201).json({ mensaje: "Entrada registrada", registro: registroConPopulate });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al registrar entrada", error });
  }
};

exports.registrarSalida = async (req, res) => {
  try {
    const { id } = req.params;
    const registro = await Registro.findById(id);
    if (!registro) return res.status(404).json({ mensaje: "Registro no encontrado" });
    if (registro.horaSalida) return res.status(400).json({ mensaje: "Este registro ya tiene salida registrada" });

    registro.horaSalida = new Date();
    await registro.save();

    const registroConPopulate = await Registro.findById(registro._id).populate("vehiculo");
    res.json({ mensaje: "Salida registrada", registro: registroConPopulate });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar salida", error });
  }
};

exports.listarRegistros = async (req, res) => {
  try {
    const { page = 1, limit = 20, activos, vehiculo, placa } = req.query;

    const filter = {};
    if (activos === "true") filter.horaSalida = null;
    if (vehiculo) filter.vehiculo = vehiculo;
    if (placa) {
      const vehiculos = await Vehiculo.find({ placa: { $regex: placa, $options: "i" } }).select("_id");
      if (vehiculos.length > 0) {
        filter.vehiculo = { $in: vehiculos.map((v) => v._id) };
      } else {
        filter.vehiculo = null;
      }
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
      populate: "vehiculo",
    };

    const result = await Registro.paginate(filter, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar registros", error });
  }
};

exports.eliminarRegistro = async (req, res) => {
  try {
    await Registro.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Registro eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar registro", error });
  }
};
