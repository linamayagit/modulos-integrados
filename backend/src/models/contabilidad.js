const mongoose = require("mongoose");

const contabilidadSchema = new mongoose.Schema({
  tipo: { type: String, required: true },       // "Ingreso" o "Egreso"
  monto: { type: Number, required: true },      // Valor del movimiento
  descripcion: { type: String, required: true },// Detalle del movimiento
  fecha: { type: Date, default: Date.now },     // Fecha del registro
  responsable: { type: String, required: true } // Persona que lo registró
}, { timestamps: true });

module.exports = mongoose.model("Contabilidad", contabilidadSchema);
