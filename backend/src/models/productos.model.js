const db = require("../config/db");

class ProductoModel {
  // OBTENER TODAS LAS ESPECIFICACIONES DE PRODUCTOS
  static async obtenerTodos() {
    const [rows] = await db.query(
      `SELECT *
       FROM especificaciones_producto
       ORDER BY fecha_actualizacion DESC, item ASC`,
    );
    return rows;
  }

  //BUSCAR UN PRODUCTO ESPECÍFICO POR SU CÓDIGO DE ITEM
  static async obtenerPorItem(item) {
    const [rows] = await db.query(
      "SELECT * FROM especificaciones_producto WHERE item = ?",
      [item],
    );
    return rows[0];
  }

  static async crear(producto) {
    const {
      item,
      descripcion,
      single_item,
      gramos_por_pieza,
      libras_pieza_chocolate,
      libras_pieza_arroz,
      piezas_caja,
      piezas_display,
      item_molde,
      total_moldes,
      unidades_por_molde,
      moldes_en_banda,
      piezas_singles_en_banda,
    } = producto;

    await db.query(
      `INSERT INTO especificaciones_producto
       (item, descripcion, single_item, gramos_por_pieza, libras_pieza_chocolate, libras_pieza_arroz,
        piezas_caja, piezas_display, item_molde, total_moldes, unidades_por_molde, moldes_en_banda,
        piezas_singles_en_banda)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item,
        descripcion,
        single_item,
        gramos_por_pieza,
        libras_pieza_chocolate,
        libras_pieza_arroz,
        piezas_caja,
        piezas_display,
        item_molde,
        total_moldes,
        unidades_por_molde,
        moldes_en_banda,
        piezas_singles_en_banda,
      ],
    );

    return this.obtenerPorItem(item);
  }

  static async actualizar(item, producto) {
    const {
      descripcion,
      single_item,
      gramos_por_pieza,
      libras_pieza_chocolate,
      libras_pieza_arroz,
      piezas_caja,
      piezas_display,
      item_molde,
      total_moldes,
      unidades_por_molde,
      moldes_en_banda,
      piezas_singles_en_banda,
    } = producto;

    await db.query(
      `UPDATE especificaciones_producto
       SET descripcion = COALESCE(?, descripcion),
           single_item = COALESCE(?, single_item),
           gramos_por_pieza = COALESCE(?, gramos_por_pieza),
           libras_pieza_chocolate = COALESCE(?, libras_pieza_chocolate),
           libras_pieza_arroz = COALESCE(?, libras_pieza_arroz),
           piezas_caja = COALESCE(?, piezas_caja),
           piezas_display = COALESCE(?, piezas_display),
           item_molde = COALESCE(?, item_molde),
           total_moldes = COALESCE(?, total_moldes),
           unidades_por_molde = COALESCE(?, unidades_por_molde),
           moldes_en_banda = COALESCE(?, moldes_en_banda),
           piezas_singles_en_banda = COALESCE(?, piezas_singles_en_banda),
           fecha_actualizacion = NOW()
       WHERE item = ?`,
      [
        descripcion,
        single_item,
        gramos_por_pieza,
        libras_pieza_chocolate,
        libras_pieza_arroz,
        piezas_caja,
        piezas_display,
        item_molde,
        total_moldes,
        unidades_por_molde,
        moldes_en_banda,
        piezas_singles_en_banda,
        item,
      ],
    );

    return this.obtenerPorItem(item);
  }

  static async eliminar(item) {
    const [result] = await db.query(
      "DELETE FROM especificaciones_producto WHERE item = ?",
      [item],
    );
    return result.affectedRows > 0;
  }
}

module.exports = ProductoModel;
