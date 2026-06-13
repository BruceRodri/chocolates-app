class ProductosView {
  //FORMATEA UN SOLO PRODUCTO CON SUS DETALLES INDUSTRIALES
  static renderizarUnProducto(producto) {
    return {
      codigoItem: producto.item,
      descripcion: producto.descripcion,
      itemIndividual: producto.single_item,
      peso: {
        gramos: Number(producto.gramos_por_pieza),
        librasChocolate: Number(producto.libras_pieza_chocolate),
        librasArroz: Number(producto.libras_pieza_arroz),
      },
      empaque: {
        piezasPorCaja: producto.piezas_caja,
        piezasPorDisplay: producto.piezas_display,
      },
      maquinaria: {
        molde: producto.item_molde,
        totalMoldes: producto.total_moldes,
        unidadesPorMolde: producto.unidades_por_molde,
        moldesEnBanda: producto.moldes_en_banda,
        piezasEnBanda: producto.piezas_singles_en_banda,
      },
      fechaActualizacion: producto.fecha_actualizacion,
    };
  }

  //MAPEA LA LISTA COMPLETA DE PRODUCTOS
  static renderizarListaProductos(productos) {
    return productos.map((producto) => this.renderizarUnProducto(producto));
  }
}

module.exports = ProductosView;
