require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const logger = require("./utils/logger");
const swaggerSpec = require("./utils/swagger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Seguridad
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "10kb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { mensaje: "Demasiadas solicitudes, intenta de nuevo en 15 minutos" },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { mensaje: "Demasiados intentos de inicio de sesión, intenta de nuevo en 15 minutos" },
});
app.use("/api", limiter);
app.use("/api/usuarios/login", authLimiter);
app.use("/api/auth", authLimiter);

// Documentación
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info("✅ MongoDB conectado"))
  .catch((err) => logger.error("❌ Error MongoDB:", err));

// Rutas
app.get("/", (req, res) => {
  res.json({ mensaje: "ParkNet API funcionando", docs: "/api-docs" });
});

const usuarioRoutes = require("./routes/usuarioroutes");
app.use("/api/usuarios", usuarioRoutes);

const vehiculoRoutes = require("./routes/vehiculoroutes");
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

// Error handler
app.use(errorHandler);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Servidor corriendo en http://localhost:${PORT}`);
});
