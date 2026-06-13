const db = require("../config/db");

class StockModel {
  static async obtenerTodos() {
    const [rows] = await db.query(
      `SELECT s.*, u.nombre_apellido AS usuario, tc.nombre_tipo AS tipo_chocolate
       FROM stock s
       JOIN usuarios u ON s.id_usuario = u.id_usuario
       JOIN tipos_chocolate tc ON s.item_chocolate_tanque = tc.id_tipo
       ORDER BY s.fecha_registro DESC, s.id_stock DESC`,
    );
    return rows;
  }

  static async obtenerPorId(id) {
    const [rows] = await db.query(
      `SELECT s.*, u.nombre_apellido AS usuario, tc.nombre_tipo AS tipo_chocolate
       FROM stock s
       JOIN usuarios u ON s.id_usuario = u.id_usuario
       JOIN tipos_chocolate tc ON s.item_chocolate_tanque = tc.id_tipo
       WHERE s.id_stock = ?`,
      [id],
    );
    return rows[0];
  }

  static async crear(datos) {
    const {
      fecha_registro, id_turno, id_usuario, item_chocolate_tanque, item_corriendo,
      moldes_libras, banda_libras, morcos_libras, temper_libras, pti_libras,
      hopper_libras, piso_libras, devuelto_libras, bandejas_libras, proceso_libras,
    } = datos;

    const [result] = await db.query(
      `INSERT INTO stock
       (fecha_registro, id_turno, id_usuario, item_chocolate_tanque, item_corriendo,
        moldes_libras, banda_libras, morcos_libras, temper_libras, pti_libras,
        hopper_libras, piso_libras, devuelto_libras, bandejas_libras, proceso_libras)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fecha_registro || new Date(), id_turno, id_usuario, item_chocolate_tanque, item_corriendo || null,
        moldes_libras || 0, banda_libras || 0, morcos_libras || 0, temper_libras || 0, pti_libras || 0,
        hopper_libras || 0, piso_libras || 0, devuelto_libras || 0, bandejas_libras || 0, proceso_libras || 0,
      ],
    );

    return this.obtenerPorId(result.insertId);
  }

  static async actualizar(id, datos) {
    const campos = [
      "fecha_registro", "id_turno", "id_usuario", "item_chocolate_tanque", "item_corriendo",
      "moldes_libras", "banda_libras", "morcos_libras", "temper_libras", "pti_libras",
      "hopper_libras", "piso_libras", "devuelto_libras", "bandejas_libras", "proceso_libras",
    ];

    const asignaciones = campos
      .filter((campo) => datos[campo] !== undefined)
      .map((campo) => `${campo} = ?`);

    if (!asignaciones.length) return this.obtenerPorId(id);

    const valores = campos
      .filter((campo) => datos[campo] !== undefined)
      .map((campo) => datos[campo]);

    await db.query(
      `UPDATE stock SET ${asignaciones.join(", ")} WHERE id_stock = ?`,
      [...valores, id],
    );

    return this.obtenerPorId(id);
  }

  static async eliminar(id) {
    const [result] = await db.query("DELETE FROM stock WHERE id_stock = ?", [id]);
    return result.affectedRows > 0;
  }
}

module.exports = StockModel;
