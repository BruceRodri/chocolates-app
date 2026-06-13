const StockModel = require("../models/stock.model");
const StockView = require("../views/stock.view");

class StockController {
  static async listar(req, res) {
    try {
      const items = await StockModel.obtenerTodos();
      const formateados = StockView.renderizarListaItems(items);
      res.status(200).json({ ok: true, count: formateados.length, data: formateados });
    } catch (error) {
      res.status(500).json({ ok: false, mensaje: "ERROR AL LISTAR STOCK", error: error.message });
    }
  }

  static async buscar(req, res) {
    try {
      const item = await StockModel.obtenerPorId(req.params.id);
      if (!item) {
        return res.status(404).json({ ok: false, mensaje: "STOCK NO ENCONTRADO" });
      }
      res.status(200).json({ ok: true, data: StockView.renderizarUnItem(item) });
    } catch (error) {
      res.status(500).json({ ok: false, mensaje: "ERROR AL BUSCAR STOCK", error: error.message });
    }
  }

  static async crear(req, res) {
    try {
      const item = await StockModel.crear(req.body);
      res.status(201).json({ ok: true, data: StockView.renderizarUnItem(item) });
    } catch (error) {
      res.status(500).json({ ok: false, mensaje: "ERROR AL CREAR STOCK", error: error.message });
    }
  }

  static async actualizar(req, res) {
    try {
      const item = await StockModel.actualizar(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ ok: false, mensaje: "STOCK NO ENCONTRADO" });
      }
      res.status(200).json({ ok: true, data: StockView.renderizarUnItem(item) });
    } catch (error) {
      res.status(500).json({ ok: false, mensaje: "ERROR AL ACTUALIZAR STOCK", error: error.message });
    }
  }

  static async eliminar(req, res) {
    try {
      const eliminado = await StockModel.eliminar(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ ok: false, mensaje: "STOCK NO ENCONTRADO" });
      }
      res.status(200).json({ ok: true, mensaje: "STOCK ELIMINADO" });
    } catch (error) {
      res.status(500).json({ ok: false, mensaje: "ERROR AL ELIMINAR STOCK", error: error.message });
    }
  }
}

module.exports = StockController;
