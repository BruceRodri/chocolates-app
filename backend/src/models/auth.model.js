const db = require("../config/db");

class AuthModel {
  static async obtenerPorUsername(username) {
    const [rows] = await db.query(
      `SELECT id_usuario, nombre_apellido, id_turno, cargo, username, password_hash, rol, activo
       FROM usuarios
       WHERE username = ?`,
      [username],
    );
    return rows[0];
  }

  static async obtenerPorId(id) {
    const [rows] = await db.query(
      `SELECT id_usuario, nombre_apellido, id_turno, cargo, username, rol, activo
       FROM usuarios
       WHERE id_usuario = ?`,
      [id],
    );
    return rows[0];
  }
}

module.exports = AuthModel;
