class TiposChocolateView {
  // FORMATEA UN TIPO DE CHOCOLATE INDIVIDUAL
  static renderizarUnTipo(tipo) {
    return {
      idTipo: tipo.id_tipo,
      categoria: tipo.nombre_tipo.toUpperCase(), // ASEGURAMOS QUE VAYA EN MAYÚSCULAS
      fechaActualizacion: tipo.fecha_actualizacion,
    };
  }

  // MAPEA LA LISTA DE TIPOS
  static renderizarListaTipos(tipos) {
    return tipos.map((tipo) => this.renderizarUnTipo(tipo));
  }
}

module.exports = TiposChocolateView;
