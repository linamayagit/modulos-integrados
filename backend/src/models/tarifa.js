const mongoose = require("mongoose");

const tarifaSchema = new mongoose.Schema({
  tipoVehiculo: { type: String, required: true },   // Carro, moto, bicicleta
  precioHora: { type: Number, required: true },     // Valor por hora
  precioDia: { type: Number, required: true }       // Valor por día
}, { timestamps: true });

module.exports = mongoose.model("Tarifa", tarifaSchema);
