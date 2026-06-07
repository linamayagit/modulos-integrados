const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const parqueaderoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  capacidad: { type: Number, required: true, min: 1 }
}, { timestamps: true });

parqueaderoSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Parqueadero", parqueaderoSchema);
