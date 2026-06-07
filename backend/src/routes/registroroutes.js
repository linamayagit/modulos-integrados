const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const registroController = require("../controllers/registroController");

router.post("/entrada", authMiddleware, registroController.registrarEntrada);
router.put("/salida/:id", authMiddleware, registroController.registrarSalida);
router.get("/listar", authMiddleware, registroController.listarRegistros);
router.delete("/eliminar/:id", authMiddleware, registroController.eliminarRegistro);

module.exports = router;
