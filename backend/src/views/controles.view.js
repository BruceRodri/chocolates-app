class ControlesView {
  static normalizarPorcentaje(valor) {
    const num = Number(valor);
    if (num > 0 && num <= 1) return num * 100;
    return num;
  }

  //FORMATEA EL REPORTE MATEMÁTICO DEL BALANCE DIARIO
  static renderizarUnBalance(balance) {
    return {
      idControl: balance.id_control,
      fecha: balance.fecha_registro,
      operario: balance.usuario,
      turno: balance.turno,
      tipoChocolate: {
        codigo: balance.item_chocolate_tanque,
        categoria: balance.tipo_chocolate,
      },
      producto: {
        codigo: balance.item,
        nombre: balance.descripcion,
      },
      calculosLibras: {
        enMoldes: Number(balance.libras_en_moldes),
        enBanda: Number(balance.libras_banda),
        enTanqueMorcos: Number(balance.libras_tanque_morcos),
        enTemperUnit: Number(balance.libras_temper_unit),
        enTanquePti: Number(balance.libras_tanque_pti),
        enHopper: Number(balance.libras_hopper),
        enPiso: Number(balance.libras_chocolate_piso),
        enBandejas: Number(balance.libras_bandejas),
        enProcesoTerminado: Number(balance.libras_producto_en_proceso),
      },
      editablesLibras: {
        moldes: Number(balance.moldes_libras || 0),
        banda: Number(balance.banda_libras || 0),
        morcos: Number(balance.morcos_libras || 0),
        temper: Number(balance.temper_libras || 0),
        pti: Number(balance.pti_libras || 0),
        hopper: Number(balance.hopper_libras || 0),
        piso: Number(balance.piso_libras || 0),
        devuelto: Number(balance.devuelto_libras || 0),
        bandejas: Number(balance.bandejas_libras || 0),
        proceso: Number(balance.proceso_libras || 0),
      },
      insumos: {
        moldesLlenados: Number(balance.raw_moldes_llenados),
        porcentajeSinglesBanda: this.normalizarPorcentaje(balance.raw_porcentaje_singles_banda),
        bandejasConChocolate: Number(balance.raw_bandejas_con_chocolate),
        productoTerminadoProceso: Number(balance.raw_producto_terminado_proceso),
        porcentajeTanqueMorcos: this.normalizarPorcentaje(balance.raw_porcentaje_tanque_morcos),
        temperUnitLibras: Number(balance.raw_temper_unit_libras),
        porcentajeTanquePti: this.normalizarPorcentaje(balance.raw_porcentaje_tanque_pti),
        hopperLibras: Number(balance.raw_hopper_libras),
        porcentajeChocolatePiso: this.normalizarPorcentaje(balance.raw_porcentaje_chocolate_piso),
        totalPesoPalet: Number(balance.raw_total_peso_palet),
      },
      totalesSistema: {
        totalChocolateFisico: Number(balance.total_chocolate_fisico),
        totalChocolateTeoricoSistema: Number(balance.total_chocolate_sistema),
        ajusteAdicionRetiro: Number(balance.cantidad_a_agregar_al_sistema),
        ajusteRetiro: Number(balance.cantidad_a_retirar_del_sistema),
      },
    };
  }

  // MAPEA LA LISTA DE BALANCES DIARIOS
  static renderizarListaBalances(balances) {
    return balances.map((balance) => this.renderizarUnBalance(balance));
  }
}

module.exports = ControlesView;
