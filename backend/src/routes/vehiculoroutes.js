const express = require("express");
const router = express.Router();
const vehiculoController = require("../controllers/vehiculoController");

// CREAR VEHÍCULO
router.post("/", vehiculoController.registrarVehiculo);

// LISTAR VEHÍCULOS
router.get("/", vehiculoController.listarVehiculos);

// ELIMINAR VEHÍCULO
router.delete("/:id", vehiculoController.eliminarVehiculo);

module.exports = router;
