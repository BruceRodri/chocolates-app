const ProductoModel = require("../models/productos.model");
// COMENTARIO: IMPORTAMOS LA VISTA DE PRODUCTOS
const ProductosView = require("../views/productos.view");

class ProductosController {
  static async listarProductos(req, res) {
    try {
      const productos = await ProductoModel.obtenerTodos();
      // COMENTARIO: PASAMOS LA DATA POR LA VISTA
      const productosFormateados =
        ProductosView.renderizarListaProductos(productos);

      res.status(200).json({
        ok: true,
        count: productosFormateados.length,
        data: productosFormateados,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL TRAER LAS ESPECIFICACIONES DE PRODUCTO",
        error: error.message,
      });
    }
  }

  static async buscarProducto(req, res) {
    try {
      const { item } = req.params;
      const producto = await ProductoModel.obtenerPorItem(item);

      if (!producto) {
        return res.status(404).json({
          ok: false,
          mensaje:
            "EL ITEM DE PRODUCTO ESPECIFICADO NO EXISTE EN LA DATA MAESTRA",
        });
      }

      // COMENTARIO: PASAMOS EL PRODUCTO ÚNICO POR LA VISTA
      const productoFormateado = ProductosView.renderizarUnProducto(producto);

      res.status(200).json({
        ok: true,
        data: productoFormateado,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR INTERNO AL BUSCAR EL PRODUCTO",
        error: error.message,
      });
    }
  }

  static async crearProducto(req, res) {
    try {
      const producto = await ProductoModel.crear(req.body);
      res.status(201).json({
        ok: true,
        data: ProductosView.renderizarUnProducto(producto),
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL CREAR EL PRODUCTO",
        error: error.message,
      });
    }
  }

  static async actualizarProducto(req, res) {
    try {
      const producto = await ProductoModel.actualizar(req.params.item, req.body);
      if (!producto) {
        return res.status(404).json({
          ok: false,
          mensaje: "PRODUCTO NO ENCONTRADO",
        });
      }

      res.status(200).json({
        ok: true,
        data: ProductosView.renderizarUnProducto(producto),
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL ACTUALIZAR EL PRODUCTO",
        error: error.message,
      });
    }
  }

  static async eliminarProducto(req, res) {
    try {
      const eliminado = await ProductoModel.eliminar(req.params.item);
      if (!eliminado) {
        return res.status(404).json({
          ok: false,
          mensaje: "PRODUCTO NO ENCONTRADO",
        });
      }

      res.status(200).json({
        ok: true,
        mensaje: "PRODUCTO ELIMINADO",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "ERROR AL ELIMINAR EL PRODUCTO",
        error: error.message,
      });
    }
  }
}

module.exports = ProductosController;
