const express = require("express");
const router = express.Router();
const parqueaderoController = require("../controllers/parqueaderoController");

router.post("/registrar", parqueaderoController.registrarParqueadero);
router.get("/listar", parqueaderoController.listarParqueaderos);
router.delete("/eliminar/:id", parqueaderoController.eliminarParqueadero);

module.exports = router;
