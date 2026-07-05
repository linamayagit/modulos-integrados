const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const registroSchema = new mongoose.Schema({
  vehiculo: { type: mongoose.Schema.Types.ObjectId, ref: "Vehiculo", required: true },
  horaEntrada: { type: Date, default: Date.now },
  horaSalida: { type: Date, default: null },
  observaciones: { type: String },
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }
}, { timestamps: true });

registroSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Registro", registroSchema);
