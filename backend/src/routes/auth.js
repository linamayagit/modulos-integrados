const express = require("express");
const router = express.Router();

// Ruta de login
router.post("/login", (req, res) => {
  const { correo, contraseña } = req.body;

  // Validación básica de ejemplo
  if (correo === "admin@example.com" && contraseña === "1234") {
    return res.json({
      mensaje: "Login exitoso",
      token: "abc123" // aquí podrías generar un JWT real
    });
  }

  res.status(401).json({ mensaje: "Credenciales inválidas" });
});

module.exports = router;



