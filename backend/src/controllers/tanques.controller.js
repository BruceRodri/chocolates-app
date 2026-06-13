const TanqueModel = require("../models/tanques.model");
//IMPORTAMOS LA VISTA DE TANQUES
const TanquesView = require("../views/tanques.view");

class TanquesController {
  static async listarTanques(req, res) {
    try {
      const tanques = await TanqueModel.obtenerTodos();
      //PASAMOS LA DATA CRUDA POR LA VISTA FORMATEADORA
      const tanquesFormateados = TanquesView.renderizarListaTanques(tanques);

      res.status(200).json({
        ok: true,
        count: tanquesFormateados.length,
        data: tanquesFormateados,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL EXTRAER LOS TANQUES DE ALMACENAMIENTO",
        error: error.message,
      });
    }
  }

  static async buscarTanque(req, res) {
    try {
      const tanque = await TanqueModel.obtenerPorNombre(req.params.nombre);
      if (!tanque) {
        return res.status(404).json({
          ok: false,
          mensaje: "TANQUE NO ENCONTRADO",
        });
      }

      res.status(200).json({
        ok: true,
        data: TanquesView.renderizarUnTanque(tanque),
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL BUSCAR EL TANQUE",
        error: error.message,
      });
    }
  }

  static async crearTanque(req, res) {
    try {
      const tanque = await TanqueModel.crear(req.body);
      res.status(201).json({
        ok: true,
        data: TanquesView.renderizarUnTanque(tanque),
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL CREAR EL TANQUE",
        error: error.message,
      });
    }
  }

  static async actualizarTanque(req, res) {
    try {
      const tanque = await TanqueModel.actualizar(req.params.nombre, req.body);
      if (!tanque) {
        return res.status(404).json({
          ok: false,
          mensaje: "TANQUE NO ENCONTRADO",
        });
      }

      res.status(200).json({
        ok: true,
        data: TanquesView.renderizarUnTanque(tanque),
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL ACTUALIZAR EL TANQUE",
        error: error.message,
      });
    }
  }

  static async eliminarTanque(req, res) {
    try {
      const eliminado = await TanqueModel.eliminar(req.params.nombre);
      if (!eliminado) {
        return res.status(404).json({
          ok: false,
          mensaje: "TANQUE NO ENCONTRADO",
        });
      }

      res.status(200).json({
        ok: true,
        mensaje: "TANQUE ELIMINADO",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL ELIMINAR EL TANQUE",
        error: error.message,
      });
    }
  }
}

module.exports = TanquesController;
