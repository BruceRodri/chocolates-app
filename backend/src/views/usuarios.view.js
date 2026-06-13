class UsuariosView {
  //RECIBE UN TRABAJADOR Y LO FORMATEA
  static renderizarUnUsuario(usuario) {
    return {
      id: usuario.id_usuario,
      nombreCompleto: usuario.nombre_apellido.toUpperCase(), // LO ENVIAMOS EN MAYÚSCULAS
      codigoTurno: usuario.id_turno,
      puestoTrabajo: usuario.cargo,
      username: usuario.username,
      rol: usuario.rol,
      activo: Boolean(usuario.activo),
      fechaConsulta: new Date().toLocaleDateString(), // AGREGAMOS DATA EN TIEMPO REAL
    };
  }

  //RECIBE LA LISTA COMPLETA DE TRABAJADORES Y LOS MAPEA UNO POR UNO
  static renderizarListaUsuarios(usuarios) {
    return usuarios.map((usuario) => this.renderizarUnUsuario(usuario));
  }
}

module.exports = UsuariosView;
