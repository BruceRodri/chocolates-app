const AuthModel = require("../models/auth.model");
const UsuariosView = require("../views/usuarios.view");
const { createToken } = require("../utils/authToken");
const { verifyPassword } = require("../utils/password");

class AuthController {
  static async login(req, res) {
    try {
      const { username, password } = req.body || {};
      if (!username || !password) {
        return res.status(400).json({
          ok: false,
          mensaje: "USERNAME_AND_PASSWORD_REQUIRED",
        });
      }

      const usuario = await AuthModel.obtenerPorUsername(username);
      if (
        !usuario ||
        !usuario.activo ||
        !verifyPassword(password, usuario.password_hash)
      ) {
        return res.status(401).json({
          ok: false,
          mensaje: "INVALID_CREDENTIALS",
        });
      }

      res.status(200).json({
        ok: true,
        token: createToken(usuario),
        data: UsuariosView.renderizarUnUsuario(usuario),
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "LOGIN_ERROR",
        error: error.message,
      });
    }
  }

  static async me(req, res) {
    try {
      const usuario = await AuthModel.obtenerPorId(req.usuario.sub);
      if (!usuario) {
        return res.status(404).json({
          ok: false,
          mensaje: "USER_NOT_FOUND",
        });
      }

      res.status(200).json({
        ok: true,
        data: UsuariosView.renderizarUnUsuario(usuario),
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "PROFILE_ERROR",
        error: error.message,
      });
    }
  }
}

module.exports = AuthController;
