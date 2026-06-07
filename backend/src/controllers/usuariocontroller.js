const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const nuevoUsuario = new Usuario({ nombre, correo, password: hashedPassword, rol });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario creado", usuario: nuevoUsuario });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear usuario", error });
  }
};

const listarUsuarios = async (req, res) => {
  try {
    const { page = 1, limit = 20, nombre, correo, rol } = req.query;

    const filter = {};
    if (nombre) filter.nombre = { $regex: nombre, $options: "i" };
    if (correo) filter.correo = { $regex: correo, $options: "i" };
    if (rol) filter.rol = rol;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
      select: "-password",
    };

    const result = await Usuario.paginate(filter, options);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al listar usuarios", error: error.message });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const { nombre, correo, rol, password } = req.body;
    const update = {};
    if (nombre) update.nombre = nombre;
    if (correo) update.correo = correo;
    if (rol) update.rol = rol;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id, update,
      { new: true, select: "-password" }
    );
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.json({ mensaje: "Usuario actualizado", usuario });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar usuario", error });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.json({ mensaje: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar usuario", error });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario._id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({ mensaje: "Inicio de sesión exitoso", token, usuario });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión", error });
  }
};

module.exports = {
  crearUsuario,
  listarUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  loginUsuario,
};