const { verifyToken } = require("../utils/authToken");

function requerirAutenticacion(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      ok: false,
      mensaje: "AUTHENTICATION_REQUIRED",
    });
  }

  const usuario = verifyToken(token);
  if (!usuario) {
    return res.status(401).json({
      ok: false,
      mensaje: "INVALID_OR_EXPIRED_TOKEN",
    });
  }

  req.usuario = usuario;
  next();
}

module.exports = {
  requerirAutenticacion,
};
