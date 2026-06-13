// IMPORTAMOS LA CONEXIÓN DEL ARCHIVO DB.JS
const db = require("../config/db");
const { hashPassword } = require("../utils/password");

class UsuarioModel {
  //OBTENER TODOS LOS TRABAJADORES
  static async obtenerTodos() {
    const [rows] = await db.query(
      "SELECT id_usuario, nombre_apellido, id_turno, cargo, username, rol, activo FROM usuarios",
    );
    return rows;
  }

  // BUSCAR UN OPERARIO POR SU ID ESPECÍFICO
  static async obtenerPorId(id) {
    const [rows] = await db.query(
      "SELECT id_usuario, nombre_apellido, id_turno, cargo, username, rol, activo FROM usuarios WHERE id_usuario = ?",
      [id],
    );
    return rows[0];
  }

  //REGISTRAR UN NUEVO EMPLEADO EN LA PLANTA
  static async crear(datosUsuario) {
    const {
      id_usuario,
      nombre_apellido,
      id_turno,
      cargo,
      username,
      password,
      rol = "operario",
      activo = true,
    } = datosUsuario;
    const password_hash = hashPassword(password);

    await db.query(
      `INSERT INTO usuarios
       (id_usuario, nombre_apellido, id_turno, cargo, username, password_hash, rol, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_usuario,
        nombre_apellido,
        id_turno,
        cargo,
        username,
        password_hash,
        rol,
        activo,
      ],
    );

    return this.obtenerPorId(id_usuario);
  }

  static async actualizar(id, datosUsuario) {
    const {
      nombre_apellido,
      id_turno,
      cargo,
      username,
      password,
      rol,
      activo,
    } = datosUsuario;
    const password_hash = password ? hashPassword(password) : null;

    await db.query(
      `UPDATE usuarios
       SET nombre_apellido = COALESCE(?, nombre_apellido),
           id_turno = COALESCE(?, id_turno),
           cargo = COALESCE(?, cargo),
           username = COALESCE(?, username),
           password_hash = COALESCE(?, password_hash),
           rol = COALESCE(?, rol),
           activo = COALESCE(?, activo)
       WHERE id_usuario = ?`,
      [
        nombre_apellido,
        id_turno,
        cargo,
        username,
        password_hash,
        rol,
        activo,
        id,
      ],
    );

    return this.obtenerPorId(id);
  }

  static async eliminar(id) {
    const [result] = await db.query("DELETE FROM usuarios WHERE id_usuario = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }
}

module.exports = UsuarioModel;
