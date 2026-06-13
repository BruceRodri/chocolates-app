const TipoChocolateModel = require("../models/tiposChocolate.model");
// IMPORTAMOS LA VISTA DE TIPOS DE CHOCOLATE
const TiposChocolateView = require("../views/tiposChocolate.view");

class TiposChocolateController {
  static async listarTipos(req, res) {
    try {
      const tipos = await TipoChocolateModel.obtenerTodos();
      //PASAMOS LOS TIPOS POR SU RESPECTIVA VISTA
      const tiposFormateados = TiposChocolateView.renderizarListaTipos(tipos);

      res.status(200).json({
        ok: true,
        count: tiposFormateados.length,
        data: tiposFormateados,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL TRAER LOS TIPOS DE CHOCOLATE",
        error: error.message,
      });
    }
  }

  static async buscarTipo(req, res) {
    try {
      const tipo = await TipoChocolateModel.obtenerPorId(req.params.id);
      if (!tipo) {
        return res.status(404).json({
          ok: false,
          mensaje: "TIPO DE CHOCOLATE NO ENCONTRADO",
        });
      }

      res.status(200).json({
        ok: true,
        data: TiposChocolateView.renderizarUnTipo(tipo),
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL BUSCAR EL TIPO DE CHOCOLATE",
        error: error.message,
      });
    }
  }

  static async crearTipo(req, res) {
    try {
      const tipo = await TipoChocolateModel.crear(req.body);
      res.status(201).json({
        ok: true,
        data: TiposChocolateView.renderizarUnTipo(tipo),
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL CREAR EL TIPO DE CHOCOLATE",
        error: error.message,
      });
    }
  }

  static async actualizarTipo(req, res) {
    try {
      const tipo = await TipoChocolateModel.actualizar(req.params.id, req.body);
      if (!tipo) {
        return res.status(404).json({
          ok: false,
          mensaje: "TIPO DE CHOCOLATE NO ENCONTRADO",
        });
      }

      res.status(200).json({
        ok: true,
        data: TiposChocolateView.renderizarUnTipo(tipo),
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL ACTUALIZAR EL TIPO DE CHOCOLATE",
        error: error.message,
      });
    }
  }

  static async eliminarTipo(req, res) {
    try {
      const eliminado = await TipoChocolateModel.eliminar(req.params.id);
      if (!eliminado) {
        return res.status(404).json({
          ok: false,
          mensaje: "TIPO DE CHOCOLATE NO ENCONTRADO",
        });
      }

      res.status(200).json({
        ok: true,
        mensaje: "TIPO DE CHOCOLATE ELIMINADO",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL ELIMINAR EL TIPO DE CHOCOLATE",
        error: error.message,
      });
    }
  }
}

module.exports = TiposChocolateController;
