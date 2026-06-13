const db = require("../config/db");

class TanqueModel {
  // OBTENER TODOS LOS TANQUES INDUSTRIALES Y SUS CAPACIDADES
  static async obtenerTodos() {
    const [rows] = await db.query(
      `SELECT nombre_tanque, capacidad_libras, fecha_actualizacion
       FROM tanques
       ORDER BY fecha_actualizacion DESC, nombre_tanque ASC`,
    );
    return rows;
  }

  static async obtenerPorNombre(nombre) {
    const [rows] = await db.query(
      "SELECT nombre_tanque, capacidad_libras, fecha_actualizacion FROM tanques WHERE nombre_tanque = ?",
      [nombre],
    );
    return rows[0];
  }

  static async crear(tanque) {
    const { nombre_tanque, capacidad_libras } = tanque;
    await db.query(
      "INSERT INTO tanques (nombre_tanque, capacidad_libras) VALUES (?, ?)",
      [nombre_tanque, capacidad_libras],
    );
    return this.obtenerPorNombre(nombre_tanque);
  }

  static async actualizar(nombre, tanque) {
    await db.query(
      "UPDATE tanques SET capacidad_libras = COALESCE(?, capacidad_libras), fecha_actualizacion = NOW() WHERE nombre_tanque = ?",
      [tanque.capacidad_libras, nombre],
    );
    return this.obtenerPorNombre(nombre);
  }

  static async eliminar(nombre) {
    const [result] = await db.query(
      "DELETE FROM tanques WHERE nombre_tanque = ?",
      [nombre],
    );
    return result.affectedRows > 0;
  }
}

module.exports = TanqueModel;
