const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const contabilidadSchema = new mongoose.Schema({
  tipo: { type: String, required: true, enum: ["Ingreso", "Egreso"] },
  monto: { type: Number, required: true, min: 0 },
  descripcion: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  responsable: { type: String, required: true }
}, { timestamps: true });

contabilidadSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Contabilidad", contabilidadSchema);
