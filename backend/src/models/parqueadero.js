const mongoose = require("mongoose");

const parqueaderoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  capacidad: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Parqueadero", parqueaderoSchema);
