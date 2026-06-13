class StockView {
  static renderizarUnItem(item) {
    const total =
      Number(item.moldes_libras || 0) +
      Number(item.banda_libras || 0) +
      Number(item.morcos_libras || 0) +
      Number(item.temper_libras || 0) +
      Number(item.pti_libras || 0) +
      Number(item.hopper_libras || 0) +
      Number(item.piso_libras || 0) +
      Number(item.devuelto_libras || 0) +
      Number(item.bandejas_libras || 0) +
      Number(item.proceso_libras || 0);

    return {
      idStock: item.id_stock,
      fecha: item.fecha_registro,
      turno: item.id_turno,
      idUsuario: item.id_usuario,
      operario: item.usuario,
      tipoChocolate: {
        codigo: item.item_chocolate_tanque,
        categoria: item.tipo_chocolate,
      },
      producto: {
        codigo: item.item_corriendo,
      },
      calculosLibras: {
        enMoldes: Number(item.moldes_libras),
        enBanda: Number(item.banda_libras),
        enTanqueMorcos: Number(item.morcos_libras),
        enTemperUnit: Number(item.temper_libras),
        enTanquePti: Number(item.pti_libras),
        enHopper: Number(item.hopper_libras),
        enPiso: Number(item.piso_libras),
        devueltoATanque: Number(item.devuelto_libras),
        enBandejas: Number(item.bandejas_libras),
        enProcesoTerminado: Number(item.proceso_libras),
      },
      totalLibras: total,
    };
  }

  static renderizarListaItems(items) {
    return items.map((item) => this.renderizarUnItem(item));
  }
}

module.exports = StockView;
