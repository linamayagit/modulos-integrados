const mongoose = require("mongoose");

const vehiculoSchema = new mongoose.Schema({
  placa: {
    type: String,
    required: true,
    unique: true,
  },
  tipo: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  propietario: {
    type: String,
    required: true,
  },
  horaEntrada: {
    type: Date,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Vehiculo", vehiculoSchema);
