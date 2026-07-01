const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const vehiculoSchema = new mongoose.Schema({
  placa: {
    type: String,
    required: true,
    unique: true,
    index: true,
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
    index: true,
  },
  horaEntrada: {
    type: Date,
  }
}, { timestamps: true });

vehiculoSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Vehiculo", vehiculoSchema);
