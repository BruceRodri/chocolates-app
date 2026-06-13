function requerirRol(...roles) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        ok: false,
        mensaje: "AUTHENTICATION_REQUIRED",
      });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        ok: false,
        mensaje: "FORBIDDEN",
      });
    }

    next();
  };
}

module.exports = {
  requerirRol,
};
