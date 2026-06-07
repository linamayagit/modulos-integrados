const mongoose = require("mongoose");

const administradorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  rol: { type: String, default: "admin" }
}, { timestamps: true });

module.exports = mongoose.model("Administrador", administradorSchema);
