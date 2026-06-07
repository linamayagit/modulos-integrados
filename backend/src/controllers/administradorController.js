const Administrador = require("../models/administrador");

// Registrar administrador
exports.registrarAdministrador = async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;
    const nuevoAdmin = new Administrador({ nombre, correo, contraseña });
    await nuevoAdmin.save();
    res.status(201).json({ mensaje: "Administrador registrado", administrador: nuevoAdmin });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al registrar administrador", error });
  }
};

// Listar administradores
exports.listarAdministradores = async (req, res) => {
  try {
    const admins = await Administrador.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar administradores", error });
  }
};

// Eliminar administrador
exports.eliminarAdministrador = async (req, res) => {
  try {
    await Administrador.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Administrador eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar administrador", error });
  }
};
