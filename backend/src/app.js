//IMPORTAMOS EXPRESS
const express = require("express");
const path = require("path");
//CREAMOS INSTANCIA DE NUESTRA APP
const app = express();
// IMPORTAMOS LAS RUTAS
const apiRouter = require("./routes");
// IMPORTAMOS EL MIDDLEWARE REGISTRADOR
const LoggerMiddleware = require("./middlewares/logger.middleware");
//MIDDLEWARE: PERMITE QUE NUESTRO SERVIDOR ENTIENDA DATOS EN FORMATO JSON
app.use(express.json());
// MIDDLEWARE: PERMITE PETICIONES DEL FRONTEND DE VITE
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});
// CUALQUIER PETICIÓN QUE LLEGUE, PASARÁ PRIMERO POR NUESTRO LOGGER
app.use(LoggerMiddleware.registrarPeticion);
// CONEXIÓN DE LAS RUTAS
app.use("/api", apiRouter);
// SERVIDO DEL FRONTEND CONSTRUIDO (PRODUCCIÓN)
const distPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(distPath));
// FALLBACK: cualquier otra ruta sirve index.html (para SPA)
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});
// MIDDLEWARE GLOBAL DE MANEJO DE ERRORES
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    ok: false,
    status: err.status,
    mensaje: err.message,
  });
});
//EXPORTAMOS LA CONFIGURACIÓN PARA QUE LA PUEDA USAR SERVER.JS
module.exports = app;
