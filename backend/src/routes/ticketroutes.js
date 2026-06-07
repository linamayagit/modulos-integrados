const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const ticketController = require("../controllers/ticketController");

router.post("/registrar", authMiddleware, ticketController.registrarTicket);
router.get("/listar", authMiddleware, ticketController.listarTickets);
router.put("/finalizar/:id", authMiddleware, ticketController.finalizarTicket);
router.delete("/eliminar/:id", authMiddleware, ticketController.eliminarTicket);

module.exports = router;
