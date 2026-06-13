class LoggerMiddleware {
  // INTERCEPTAR CUALQUIER TRÁFICO WEB
  static registrarPeticion(req, res, next) {
    const fecha = new Date().toLocaleString();
    const metodo = req.method;
    const url = req.originalUrl;

    console.log(`[${fecha}] PETICIÓN ENTRANTE: [${metodo}] -> RUTA: ${url}`);

    next();
  }
}

module.exports = LoggerMiddleware;
