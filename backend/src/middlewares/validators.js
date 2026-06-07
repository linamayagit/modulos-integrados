const { body, validationResult } = require("express-validator");

const manejarErroresValidacion = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ mensaje: "Error de validación", errores: errors.array() });
  }
  next();
};

const validarCrearUsuario = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio").trim(),
  body("correo").isEmail().withMessage("Correo inválido").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  manejarErroresValidacion,
];

const validarLogin = [
  body("correo").isEmail().withMessage("Correo inválido").normalizeEmail(),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  manejarErroresValidacion,
];

const validarCrearVehiculo = [
  body("placa").notEmpty().withMessage("La placa es obligatoria").trim(),
  body("tipo").notEmpty().withMessage("El tipo es obligatorio"),
  body("propietario").notEmpty().withMessage("El propietario es obligatorio"),
  manejarErroresValidacion,
];

module.exports = {
  validarCrearUsuario,
  validarLogin,
  validarCrearVehiculo,
};
