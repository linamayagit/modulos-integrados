const express = require("express");
const router = express.Router();
const administradorController = require("../controllers/administradorController");

router.post("/registrar", administradorController.registrarAdministrador);
router.get("/listar", administradorController.listarAdministradores);
router.delete("/eliminar/:id", administradorController.eliminarAdministrador);

module.exports = router;
