const express = require("express");

const {
  crearUsuario,
  listarUsuarios,
  loginUsuario
} = require("../controllers/usuarioController");

const router = express.Router();

// Crear usuario
router.post("/", crearUsuario);

// Listar usuarios
router.get("/", listarUsuarios);

// Iniciar sesión
router.post("/login", loginUsuario);

module.exports = router;

