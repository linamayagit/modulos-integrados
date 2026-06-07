const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { validarCrearVehiculo } = require("../middlewares/validators");
const vehiculoController = require("../controllers/vehiculoController");

// CREAR VEHÍCULO
router.post("/", authMiddleware, validarCrearVehiculo, vehiculoController.registrarVehiculo);

// LISTAR VEHÍCULOS
router.get("/", authMiddleware, vehiculoController.listarVehiculos);

// ACTUALIZAR VEHÍCULO
router.put("/:id", authMiddleware, vehiculoController.actualizarVehiculo);

// ELIMINAR VEHÍCULO
router.delete("/:id", authMiddleware, vehiculoController.eliminarVehiculo);

module.exports = router;
