//IMPORTAMOS EXPRESS
const express = require("express");
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
// RUTA DE BIENVENIDA
app.get("/", (req, res) => {
  res.json({ mensaje: "SISTEMA DE CHOCOLATES" });
});
// CONEXIÓN DE LAS RUTAS
app.use("/api", apiRouter);
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
