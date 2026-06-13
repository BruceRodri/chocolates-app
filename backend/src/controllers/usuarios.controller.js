// IMPORTAMOS EL MODELO
const UsuarioModel = require("../models/usuarios.model");
const UsuariosView = require("../views/usuarios.view");
class UsuariosController {
  //MANEJADOR PARA TRAER TODOS LOS TRABAJADORES
  static async listarUsuarios(req, res) {
    try {
      const usuarios = await UsuarioModel.obtenerTodos();
      //PASAMOS LA DATA POR EL FILTRO FORMATEADOR DE LA VISTA
      const usuariosFormateados =
        UsuariosView.renderizarListaUsuarios(usuarios);
      // RESPONDEMOS CON UN ESTADO 200 (OK) Y LOS DATOS EN JSON
      res.status(200).json({
        ok: true,
        count: usuariosFormateados.length,
        data: usuariosFormateados,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL EXTRAER LOS TRABAJADORES DE LA PLANTA",
        error: error.message,
      });
    }
  }

  //MANEJADOR PARA BUSCAR UN TRABAJADOR POR SU ID
  static async buscarUsuario(req, res) {
    try {
      // LOS PARÁMETROS QUE VIENEN EN LA URL SE GUARDAN EN REQ.PARAMS
      const { id } = req.params;
      const usuario = await UsuarioModel.obtenerPorId(id);

      if (!usuario) {
        return res.status(404).json({
          ok: false,
          mensaje: "EL TRABAJADOR NO ENTRA EN LOS REGISTROS MAESTROS",
        });
      }
      // PASAMOS EL ELEMENTO ÚNICO POR LA VISTA
      const usuarioFormateado = UsuariosView.renderizarUnUsuario(usuario);
      res.status(200).json({
        ok: true,
        data: usuarioFormateado,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR INTERNO DEL SERVIDOR AL BUSCAR",
        error: error.message,
      });
    }
  }

  static async crearUsuario(req, res) {
    try {
      const { id_usuario, nombre_apellido, id_turno, cargo, username, password } =
        req.body || {};

      if (
        !id_usuario ||
        !nombre_apellido ||
        !id_turno ||
        !cargo ||
        !username ||
        !password
      ) {
        return res.status(400).json({
          ok: false,
          mensaje: "FALTAN CAMPOS OBLIGATORIOS PARA CREAR EL USUARIO",
        });
      }

      const usuario = await UsuarioModel.crear(req.body);
      res.status(201).json({
        ok: true,
        data: UsuariosView.renderizarUnUsuario(usuario),
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL CREAR EL USUARIO",
        error: error.message,
      });
    }
  }

  static async actualizarUsuario(req, res) {
    try {
      const usuario = await UsuarioModel.actualizar(req.params.id, req.body);
      if (!usuario) {
        return res.status(404).json({
          ok: false,
          mensaje: "USUARIO NO ENCONTRADO",
        });
      }

      res.status(200).json({
        ok: true,
        data: UsuariosView.renderizarUnUsuario(usuario),
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL ACTUALIZAR EL USUARIO",
        error: error.message,
      });
    }
  }

  static async eliminarUsuario(req, res) {
    try {
      const eliminado = await UsuarioModel.eliminar(req.params.id);
      if (!eliminado) {
        return res.status(404).json({
          ok: false,
          mensaje: "USUARIO NO ENCONTRADO",
        });
      }

      res.status(200).json({
        ok: true,
        mensaje: "USUARIO ELIMINADO",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL ELIMINAR EL USUARIO",
        error: error.message,
      });
    }
  }
}

module.exports = UsuariosController;
