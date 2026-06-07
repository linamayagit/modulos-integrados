const express = require("express");
const router = express.Router();
const tarifaController = require("../controllers/tarifaController");

router.post("/registrar", tarifaController.registrarTarifa);
router.get("/listar", tarifaController.listarTarifas);
router.delete("/eliminar/:id", tarifaController.eliminarTarifa);

module.exports = router;
