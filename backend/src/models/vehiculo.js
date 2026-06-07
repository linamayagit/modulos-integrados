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
  },
  modelo: {
    type: String,
  },
  propietario: {
    type: String,
    required: true,
  },
  horaEntrada: {
    type: Date,
  }
}, { timestamps: true });

module.exports = mongoose.model("Vehiculo", vehiculoSchema);
