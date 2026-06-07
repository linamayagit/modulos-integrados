const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const tarifaController = require("../controllers/tarifaController");

router.post("/registrar", authMiddleware, tarifaController.registrarTarifa);
router.get("/listar", authMiddleware, tarifaController.listarTarifas);
router.put("/actualizar/:id", authMiddleware, tarifaController.actualizarTarifa);
router.delete("/eliminar/:id", authMiddleware, tarifaController.eliminarTarifa);

module.exports = router;
