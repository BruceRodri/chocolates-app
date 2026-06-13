class TanquesView {
  //  FORMATEA UN SOLO TANQUE CON SU CAPACIDAD LIMPIA
  static renderizarUnTanque(tanque) {
    return {
      nombre: tanque.nombre_tanque,
      capacidadLibras: Number(tanque.capacidad_libras),
      fechaActualizacion: tanque.fecha_actualizacion,
    };
  }

  // MAPEA LA LISTA DE TANQUES
  static renderizarListaTanques(tanques) {
    return tanques.map((tanque) => this.renderizarUnTanque(tanque));
  }
}

module.exports = TanquesView;
