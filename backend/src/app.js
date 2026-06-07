const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/parqueadero")
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Error MongoDB:", err));

// Rutas
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  
  res.send("Servidor funcionando");
});

const usuarioRoutes = require("./routes/usuarioroutes");
app.use("/api/usuarios", usuarioRoutes);


const vehiculoRoutes = require("./routes/vehiculoroutes");

// ...
app.use("/api/vehiculos", vehiculoRoutes);

const parqueaderoRoutes = require("./routes/parqueaderoroutes");
app.use("/api/parqueaderos", parqueaderoRoutes);

const tarifaRoutes = require("./routes/tarifaroutes");
app.use("/api/tarifas", tarifaRoutes);

const ticketRoutes = require("./routes/ticketroutes");
app.use("/api/tickets", ticketRoutes);

const registroRoutes = require("./routes/registroroutes");
app.use("/api/registros", registroRoutes);

const contabilidadRoutes = require("./routes/contabilidadroutes");
app.use("/api/contabilidad", contabilidadRoutes);

const administradorRoutes = require("./routes/administradorroutes");
app.use("/api/administradores", administradorRoutes);


// Servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
