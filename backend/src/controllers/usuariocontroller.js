// Controlador de Usuarios
const Usuario = require("../models/usuario");

// Crear usuario
const crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al crear usuario",
      error,
    });
  }
};

// Listar usuarios
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();

    console.log("USUARIOS ENCONTRADOS:", usuarios);

    return res.status(200).json(usuarios);
  } catch (error) {
    console.error("🔥 ERROR COMPLETO:");
    console.error(error); // <-- ESTE ES EL IMPORTANTE

    return res.status(500).json({
      mensaje: "Error al listar usuarios",
      error: error.message, // 👈 clave para ver el problema real
    });
  }
};

// Iniciar sesión
const loginUsuario = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    if (usuario.password !== password) {
      return res.status(401).json({
        mensaje: "Contraseña incorrecta",
      });
    }

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      usuario,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al iniciar sesión",
      error,
    });
  }
};

module.exports = {
  crearUsuario,
  listarUsuarios,
  loginUsuario,
};