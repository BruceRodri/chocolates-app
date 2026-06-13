const db = require("../config/db");

class TipoChocolateModel {
  // OBTENER TODOS LOS TIPOS DE CHOCOLATE REGISTRADOS
  static async obtenerTodos() {
    const [rows] = await db.query(
      `SELECT id_tipo, nombre_tipo, fecha_actualizacion
       FROM tipos_chocolate
       ORDER BY fecha_actualizacion DESC, id_tipo ASC`,
    );
    return rows;
  }

  static async obtenerPorId(id) {
    const [rows] = await db.query(
      "SELECT id_tipo, nombre_tipo, fecha_actualizacion FROM tipos_chocolate WHERE id_tipo = ?",
      [id],
    );
    return rows[0];
  }

  static async crear(tipo) {
    const { id_tipo, nombre_tipo } = tipo;
    await db.query(
      "INSERT INTO tipos_chocolate (id_tipo, nombre_tipo) VALUES (?, ?)",
      [id_tipo, nombre_tipo],
    );
    return this.obtenerPorId(id_tipo);
  }

  static async actualizar(id, tipo) {
    await db.query(
      "UPDATE tipos_chocolate SET nombre_tipo = COALESCE(?, nombre_tipo), fecha_actualizacion = NOW() WHERE id_tipo = ?",
      [tipo.nombre_tipo, id],
    );
    return this.obtenerPorId(id);
  }

  static async eliminar(id) {
    const [result] = await db.query(
      "DELETE FROM tipos_chocolate WHERE id_tipo = ?",
      [id],
    );
    return result.affectedRows > 0;
  }
}

module.exports = TipoChocolateModel;
