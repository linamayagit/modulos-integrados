const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const contabilidadController = require("../controllers/contabilidadController");

router.post("/registrar", authMiddleware, contabilidadController.registrarMovimiento);
router.get("/listar", authMiddleware, contabilidadController.listarMovimientos);
router.get("/resumen", authMiddleware, contabilidadController.resumenContabilidad);
router.put("/actualizar/:id", authMiddleware, contabilidadController.actualizarMovimiento);
router.delete("/eliminar/:id", authMiddleware, contabilidadController.eliminarMovimiento);

module.exports = router;
