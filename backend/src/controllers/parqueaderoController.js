const Parqueadero = require("../models/parqueadero");
const Registro = require("../models/registro");

exports.registrarParqueadero = async (req, res) => {
  try {
    const { nombre, direccion, capacidad } = req.body;

    if (!nombre || !direccion || capacidad == null) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }
    if (capacidad < 1) {
      return res.status(400).json({ mensaje: "La capacidad debe ser al menos 1" });
    }

    const existe = await Parqueadero.findOne({ nombre });
    if (existe) {
      return res.status(400).json({ mensaje: "Ya existe un parqueadero con ese nombre" });
    }

    const nuevo = new Parqueadero({ nombre, direccion, capacidad });
    await nuevo.save();
    res.status(201).json({ mensaje: "Parqueadero registrado", parqueadero: nuevo });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al registrar", error });
  }
};

exports.listarParqueaderos = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
    };

    const result = await Parqueadero.paginate({}, options);

    const ocupados = await Registro.countDocuments({ horaSalida: null });
    const capacidadTotal = result.docs.reduce((sum, p) => sum + p.capacidad, 0);

    res.json({
      ...result,
      resumen: {
        capacidadTotal,
        ocupados,
        disponibles: capacidadTotal - ocupados,
      },
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar", error });
  }
};

exports.actualizarParqueadero = async (req, res) => {
  try {
    const { nombre, direccion, capacidad } = req.body;

    if (!nombre || !direccion || capacidad == null) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }
    if (capacidad < 1) {
      return res.status(400).json({ mensaje: "La capacidad debe ser al menos 1" });
    }

    const duplicado = await Parqueadero.findOne({ nombre, _id: { $ne: req.params.id } });
    if (duplicado) {
      return res.status(400).json({ mensaje: "Ya existe otro parqueadero con ese nombre" });
    }

    const parqueadero = await Parqueadero.findByIdAndUpdate(
      req.params.id,
      { nombre, direccion, capacidad },
      { new: true, runValidators: true }
    );
    if (!parqueadero) return res.status(404).json({ mensaje: "Parqueadero no encontrado" });

    res.json({ mensaje: "Parqueadero actualizado", parqueadero });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar", error });
  }
};

exports.eliminarParqueadero = async (req, res) => {
  try {
    const parqueadero = await Parqueadero.findByIdAndDelete(req.params.id);
    if (!parqueadero) return res.status(404).json({ mensaje: "Parqueadero no encontrado" });
    res.json({ mensaje: "Parqueadero eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar", error });
  }
};
