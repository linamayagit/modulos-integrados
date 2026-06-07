const Ticket = require("../models/ticket");
const Tarifa = require("../models/tarifa");

// Registrar ticket
exports.registrarTicket = async (req, res) => {
  try {
    const { numeroTicket, vehiculo, tarifa, horaEntrada } = req.body;
    const nuevoTicket = new Ticket({ numeroTicket, vehiculo, tarifa, horaEntrada });
    await nuevoTicket.save();
    res.status(201).json({ mensaje: "Ticket registrado", ticket: nuevoTicket });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al registrar ticket", error });
  }
};

// Listar tickets
exports.listarTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("vehiculo").populate("tarifa");
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar tickets", error });
  }
};

// Finalizar ticket (calcular total)
exports.finalizarTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id).populate("tarifa");
    if (!ticket) return res.status(404).json({ mensaje: "Ticket no encontrado" });

    ticket.horaSalida = new Date();

    // Calcular horas de uso
    const horas = Math.ceil((ticket.horaSalida - ticket.horaEntrada) / (1000 * 60 * 60));
    ticket.total = horas * ticket.tarifa.precioHora;

    await ticket.save();
    res.json({ mensaje: "Ticket finalizado", ticket });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al finalizar ticket", error });
  }
};

// Eliminar ticket
exports.eliminarTicket = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Ticket eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar ticket", error });
  }
};
