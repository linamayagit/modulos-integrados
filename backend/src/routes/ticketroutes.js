const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");

router.post("/registrar", ticketController.registrarTicket);
router.get("/listar", ticketController.listarTickets);
router.put("/finalizar/:id", ticketController.finalizarTicket);
router.delete("/eliminar/:id", ticketController.eliminarTicket);

module.exports = router;
