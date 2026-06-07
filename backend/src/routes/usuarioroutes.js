const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { validarCrearUsuario, validarLogin } = require("../middlewares/validators");

const {
  crearUsuario,
  listarUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  loginUsuario
} = require("../controllers/usuarioController");

const router = express.Router();

// Crear usuario
router.post("/", validarCrearUsuario, crearUsuario);

// Listar usuarios (protegido)
router.get("/", authMiddleware, listarUsuarios);

// Iniciar sesión
router.post("/login", validarLogin, loginUsuario);

// Actualizar usuario (protegido)
router.put("/:id", authMiddleware, actualizarUsuario);

// Eliminar usuario (protegido)
router.delete("/:id", authMiddleware, eliminarUsuario);

module.exports = router;

