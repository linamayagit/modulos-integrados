const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    default: "usuario"
  }
}, { timestamps: true });

usuarioSchema.plugin(mongoosePaginate);

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
