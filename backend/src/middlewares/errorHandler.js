const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, url: req.originalUrl, method: req.method });

  const status = err.status || 500;
  const mensaje = err.message || "Error interno del servidor";

  res.status(status).json({
    mensaje,
    ...(process.env.NODE_ENV === "development" && { detalle: err.stack }),
  });
};

module.exports = errorHandler;
