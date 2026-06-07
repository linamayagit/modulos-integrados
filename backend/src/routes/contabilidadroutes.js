const express = require("express");
const router = express.Router();
const contabilidadController = require("../controllers/contabilidadController");

router.post("/registrar", contabilidadController.registrarMovimiento);
router.get("/listar", contabilidadController.listarMovimientos);
router.delete("/eliminar/:id", contabilidadController.eliminarMovimiento);

module.exports = router;
