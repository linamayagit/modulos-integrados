const mongoose = require("mongoose");

const registroSchema = new mongoose.Schema({
  vehiculo: { type: mongoose.Schema.Types.ObjectId, ref: "Vehiculo", required: true },
  horaEntrada: { type: Date, required: true },
  horaSalida: { type: Date },
  observaciones: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Registro", registroSchema);
