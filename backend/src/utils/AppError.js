class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // DEFINE SI EL ERRORES ES POR PROBLEMA DEL CLIENTE (4xx) O DEL SERVIDOR (5xx)
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // INDICA QUE ES UN ERROR CONTROLADO POR NOSOTROS

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
