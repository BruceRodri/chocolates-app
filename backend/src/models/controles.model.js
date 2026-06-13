const db = require("../config/db");

const LB_FIELDS = "c.moldes_libras, c.banda_libras, c.morcos_libras, c.temper_libras, c.pti_libras, c.piso_libras, c.devuelto_libras, c.bandejas_libras, c.proceso_libras"
const RAW_FIELDS = "c.moldes_llenados AS raw_moldes_llenados, c.porcentaje_singles_banda AS raw_porcentaje_singles_banda, c.porcentaje_tanque_morcos AS raw_porcentaje_tanque_morcos, c.temper_unit_libras AS raw_temper_unit_libras, c.porcentaje_tanque_pti AS raw_porcentaje_tanque_pti, c.hopper_libras AS raw_hopper_libras, c.porcentaje_chocolate_piso AS raw_porcentaje_chocolate_piso, c.total_peso_palet AS raw_total_peso_palet, c.bandejas_con_chocolate AS raw_bandejas_con_chocolate, c.producto_terminado_proceso AS raw_producto_terminado_proceso"

class ControlModel {
  //OBTENER EL BALANCE DE CHOCOLATE COMPLETO USANDO LA VISTA MATEMÁTICA
  static async obtenerBalances() {
    const [rows] = await db.query(
      `SELECT v.*, ${LB_FIELDS}, ${RAW_FIELDS}
       FROM vista_balance_chocolate v
       JOIN controles_diarios c ON v.id_control = c.id_control
       ORDER BY v.fecha_registro DESC, v.id_control DESC`,
    );
    return rows;
  }

  //BUSCAR EL REPORTE DE UN CONTROL ESPECÍFICO POR SU ID EN LA VISTA
  static async obtenerBalancePorId(id) {
    const [rows] = await db.query(
      `SELECT v.*, ${LB_FIELDS}, ${RAW_FIELDS}
       FROM vista_balance_chocolate v
       JOIN controles_diarios c ON v.id_control = c.id_control
       WHERE v.id_control = ?`,
      [id],
    );
    return rows[0];
  }

  //INSERTAR UN NUEVO REGISTRO DIARIO
  static async crear(datosControl) {
    const {
      fecha_registro,
      id_turno,
      item_chocolate_tanque,
      item_corriendo,
      moldes_llenados,
      porcentaje_singles_banda,
      porcentaje_tanque_morcos,
      temper_unit_libras,
      porcentaje_tanque_pti,
      hopper_libras,
      porcentaje_chocolate_piso,
      total_peso_palet,
      bandejas_con_chocolate,
      producto_terminado_proceso,
      total_chocolate_sistema,
      moldes_libras,
      banda_libras,
      morcos_libras,
      temper_libras,
      pti_libras,
      piso_libras,
      devuelto_libras,
      bandejas_libras,
      proceso_libras,
    } = datosControl;

    const [result] = await db.query(
      `INSERT INTO controles_diarios 
            (fecha_registro, id_usuario, id_turno, item_chocolate_tanque, item_corriendo, 
            moldes_llenados, porcentaje_singles_banda, porcentaje_tanque_morcos, temper_unit_libras, 
            porcentaje_tanque_pti, hopper_libras, porcentaje_chocolate_piso, 
            total_peso_palet, bandejas_con_chocolate, producto_terminado_proceso,
            total_chocolate_sistema,
            moldes_libras, banda_libras, morcos_libras, temper_libras, pti_libras,
            piso_libras, devuelto_libras, bandejas_libras, proceso_libras) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fecha_registro || new Date(),
        datosControl.id_usuario,
        id_turno,
        item_chocolate_tanque,
        item_corriendo,
        moldes_llenados,
        porcentaje_singles_banda,
        porcentaje_tanque_morcos,
        temper_unit_libras,
        porcentaje_tanque_pti,
        hopper_libras,
        porcentaje_chocolate_piso,
        total_peso_palet,
        bandejas_con_chocolate,
        producto_terminado_proceso,
        total_chocolate_sistema,
        moldes_libras || 0,
        banda_libras || 0,
        morcos_libras || 0,
        temper_libras || 0,
        pti_libras || 0,
        piso_libras || 0,
        devuelto_libras || 0,
        bandejas_libras || 0,
        proceso_libras || 0,
      ],
    );

    return this.obtenerBalancePorId(result.insertId);
  }

  static async actualizar(id, datosControl) {
    const {
      id_turno,
      item_chocolate_tanque,
      item_corriendo,
      moldes_llenados,
      porcentaje_singles_banda,
      porcentaje_tanque_morcos,
      temper_unit_libras,
      porcentaje_tanque_pti,
      hopper_libras,
        porcentaje_chocolate_piso,
        total_peso_palet,
        bandejas_con_chocolate,
      producto_terminado_proceso,
      total_chocolate_sistema,
      moldes_libras,
      banda_libras,
      morcos_libras,
      temper_libras,
      pti_libras,
      piso_libras,
      devuelto_libras,
      bandejas_libras,
      proceso_libras,
    } = datosControl;

    await db.query(
       `UPDATE controles_diarios
        SET id_turno = COALESCE(?, id_turno),
            item_chocolate_tanque = COALESCE(?, item_chocolate_tanque),
            item_corriendo = COALESCE(?, item_corriendo),
            moldes_llenados = COALESCE(?, moldes_llenados),
            porcentaje_singles_banda = COALESCE(?, porcentaje_singles_banda),
            porcentaje_tanque_morcos = COALESCE(?, porcentaje_tanque_morcos),
            temper_unit_libras = COALESCE(?, temper_unit_libras),
            porcentaje_tanque_pti = COALESCE(?, porcentaje_tanque_pti),
            hopper_libras = COALESCE(?, hopper_libras),
            porcentaje_chocolate_piso = COALESCE(?, porcentaje_chocolate_piso),
            total_peso_palet = COALESCE(?, total_peso_palet),
            bandejas_con_chocolate = COALESCE(?, bandejas_con_chocolate),
           producto_terminado_proceso = COALESCE(?, producto_terminado_proceso),
           total_chocolate_sistema = COALESCE(?, total_chocolate_sistema),
           moldes_libras = COALESCE(?, moldes_libras),
           banda_libras = COALESCE(?, banda_libras),
           morcos_libras = COALESCE(?, morcos_libras),
           temper_libras = COALESCE(?, temper_libras),
           pti_libras = COALESCE(?, pti_libras),
           piso_libras = COALESCE(?, piso_libras),
           devuelto_libras = COALESCE(?, devuelto_libras),
           bandejas_libras = COALESCE(?, bandejas_libras),
           proceso_libras = COALESCE(?, proceso_libras)
       WHERE id_control = ?`,
      [
        id_turno,
        item_chocolate_tanque,
        item_corriendo,
        moldes_llenados,
        porcentaje_singles_banda,
        porcentaje_tanque_morcos,
        temper_unit_libras,
        porcentaje_tanque_pti,
        hopper_libras,
        porcentaje_chocolate_piso,
        total_peso_palet,
        bandejas_con_chocolate,
        producto_terminado_proceso,
        total_chocolate_sistema,
        moldes_libras,
        banda_libras,
        morcos_libras,
        temper_libras,
        pti_libras,
        piso_libras,
        devuelto_libras,
        bandejas_libras,
        proceso_libras,
        id,
      ],
    );

    return this.obtenerBalancePorId(id);
  }

  static async eliminar(id) {
    const [result] = await db.query(
      "DELETE FROM controles_diarios WHERE id_control = ?",
      [id],
    );
    return result.affectedRows > 0;
  }
}

module.exports = ControlModel;
