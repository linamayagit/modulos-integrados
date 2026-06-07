const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  numeroTicket: { type: String, required: true, unique: true },
  vehiculo: { type: mongoose.Schema.Types.ObjectId, ref: "Vehiculo", required: true },
  tarifa: { type: mongoose.Schema.Types.ObjectId, ref: "Tarifa", required: true },
  horaEntrada: { type: Date, required: true },
  horaSalida: { type: Date },
  total: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);
