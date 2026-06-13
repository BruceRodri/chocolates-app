const ControlModel = require("../models/controles.model");
//IMPORTAMOS LA VISTA DE CONTROLES
const ControlesView = require("../views/controles.view");

class ControlesController {
  static async listarBalances(req, res) {
    try {
      const balances = await ControlModel.obtenerBalances();
      //FORMATEAMOS LOS BALANCES DIARIOS CON LA VISTA
      const balancesFormateados =
        ControlesView.renderizarListaBalances(balances);

      res.status(200).json({
        ok: true,
        count: balancesFormateados.length,
        data: balancesFormateados,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL EFECTUAR EL BALANCE DE CHOCOLATE",
        error: error.message,
      });
    }
  }

  static async buscarBalance(req, res) {
    try {
      const balance = await ControlModel.obtenerBalancePorId(req.params.id);
      if (!balance) {
        return res.status(404).json({
          ok: false,
          mensaje: "CONTROL DIARIO NO ENCONTRADO",
        });
      }

      res.status(200).json({
        ok: true,
        data: ControlesView.renderizarUnBalance(balance),
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL BUSCAR EL CONTROL DIARIO",
        error: error.message,
      });
    }
  }

  static async guardarControl(req, res) {
    try {
      const datosFormulario = {
        ...req.body,
        id_usuario: req.usuario.sub,
      };
      const nuevoControl = await ControlModel.crear(datosFormulario);

      res.status(201).json({
        ok: true,
        mensaje: "REGISTRO DIARIO ALMACENADO CORRECTAMENTE EN EL SISTEMA",
        data: ControlesView.renderizarUnBalance(nuevoControl),
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL INSERTAR EL REPORTE DIARIO",
        error: error.message,
      });
    }
  }

  static async actualizarControl(req, res) {
    try {
      const balance = await ControlModel.actualizar(req.params.id, req.body);
      if (!balance) {
        return res.status(404).json({
          ok: false,
          mensaje: "CONTROL DIARIO NO ENCONTRADO",
        });
      }

      res.status(200).json({
        ok: true,
        data: ControlesView.renderizarUnBalance(balance),
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL ACTUALIZAR EL CONTROL DIARIO",
        error: error.message,
      });
    }
  }

  static async eliminarControl(req, res) {
    try {
      const eliminado = await ControlModel.eliminar(req.params.id);
      if (!eliminado) {
        return res.status(404).json({
          ok: false,
          mensaje: "CONTROL DIARIO NO ENCONTRADO",
        });
      }

      res.status(200).json({
        ok: true,
        mensaje: "CONTROL DIARIO ELIMINADO",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL ELIMINAR EL CONTROL DIARIO",
        error: error.message,
      });
    }
  }
}

module.exports = ControlesController;
