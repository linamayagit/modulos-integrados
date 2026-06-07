const Ticket = require("../models/ticket");
const Vehiculo = require("../models/vehiculo");
const Tarifa = require("../models/tarifa");

let contadorTicket = 1;

const generarNumeroTicket = () => {
  const num = String(contadorTicket).padStart(4, "0");
  contadorTicket++;
  return `TKT-${num}`;
};

exports.registrarTicket = async (req, res) => {
  try {
    const { vehiculo: vehiculoId, tarifa: tarifaId, horaEntrada } = req.body;

    if (!vehiculoId || !tarifaId) {
      return res.status(400).json({ mensaje: "Vehículo y tarifa son obligatorios" });
    }

    const vehiculoExiste = await Vehiculo.findById(vehiculoId);
    if (!vehiculoExiste) {
      return res.status(404).json({ mensaje: "Vehículo no encontrado" });
    }

    const tarifaExiste = await Tarifa.findById(tarifaId);
    if (!tarifaExiste) {
      return res.status(404).json({ mensaje: "Tarifa no encontrada" });
    }

    const activo = await Ticket.findOne({ vehiculo: vehiculoId, horaSalida: null });
    if (activo) {
      return res.status(400).json({ mensaje: "El vehículo ya tiene un ticket activo" });
    }

    const numeroTicket = generarNumeroTicket();

    const nuevoTicket = new Ticket({
      numeroTicket,
      vehiculo: vehiculoId,
      tarifa: tarifaId,
      horaEntrada: horaEntrada || Date.now(),
    });
    await nuevoTicket.save();

    const ticketConPopulate = await Ticket.findById(nuevoTicket._id)
      .populate("vehiculo")
      .populate("tarifa");

    res.status(201).json({ mensaje: "Ticket registrado", ticket: ticketConPopulate });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al registrar ticket", error });
  }
};

exports.listarTickets = async (req, res) => {
  try {
    const { page = 1, limit = 20, activos } = req.query;

    const filter = {};
    if (activos === "true") filter.horaSalida = null;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
      populate: ["vehiculo", "tarifa"],
    };

    const result = await Ticket.paginate(filter, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar tickets", error });
  }
};

exports.finalizarTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id).populate("tarifa");
    if (!ticket) return res.status(404).json({ mensaje: "Ticket no encontrado" });
    if (ticket.horaSalida) return res.status(400).json({ mensaje: "Este ticket ya está finalizado" });

    ticket.horaSalida = new Date();

    const diffMs = ticket.horaSalida - ticket.horaEntrada;
    const horasDecimal = diffMs / (1000 * 60 * 60);
    const horas = Math.max(1, Math.round(horasDecimal * 2) / 2);

    const usaPrecioDia = horas >= 24;
    ticket.total = usaPrecioDia
      ? Math.ceil(horas / 24) * ticket.tarifa.precioDia
      : horas * ticket.tarifa.precioHora;

    await ticket.save();
    res.json({ mensaje: "Ticket finalizado", ticket });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al finalizar ticket", error });
  }
};

exports.eliminarTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ mensaje: "Ticket no encontrado" });
    res.json({ mensaje: "Ticket eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar ticket", error });
  }
};
