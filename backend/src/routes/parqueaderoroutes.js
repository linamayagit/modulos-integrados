const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const parqueaderoController = require("../controllers/parqueaderoController");

router.post("/registrar", authMiddleware, parqueaderoController.registrarParqueadero);
router.get("/listar", authMiddleware, parqueaderoController.listarParqueaderos);
router.put("/actualizar/:id", authMiddleware, parqueaderoController.actualizarParqueadero);
router.delete("/eliminar/:id", authMiddleware, parqueaderoController.eliminarParqueadero);

module.exports = router;
