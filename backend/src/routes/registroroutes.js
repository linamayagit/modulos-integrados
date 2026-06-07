const express = require("express");
const router = express.Router();
const registroController = require("../controllers/registroController");

router.post("/entrada", registroController.registrarEntrada);
router.put("/salida/:id", registroController.registrarSalida);
router.get("/listar", registroController.listarRegistros);
router.delete("/eliminar/:id", registroController.eliminarRegistro);

module.exports = router;
