const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ticketSchema = new mongoose.Schema({
  numeroTicket: { type: String, required: true, unique: true },
  vehiculo: { type: mongoose.Schema.Types.ObjectId, ref: "Vehiculo", required: true },
  tarifa: { type: mongoose.Schema.Types.ObjectId, ref: "Tarifa", required: true },
  horaEntrada: { type: Date, required: true, default: Date.now },
  horaSalida: { type: Date },
  total: { type: Number }
}, { timestamps: true });

ticketSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Ticket", ticketSchema);
