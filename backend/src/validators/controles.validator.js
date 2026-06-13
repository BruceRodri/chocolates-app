const AppError = require("../utils/AppError");

class ControlesValidator {
  static validarNuevoControl(req, res, next) {
    //SI REQ.BODY LLEGA VACÍO O INEXISTENTE, CREAMOS UN OBJETO VACÍO POR DEFECTO PARA QUE NO EXPLOTE
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        new AppError(
          "EL CUERPO DE LA PETICIÓN ESTÁ TOTALMENTE VACÍO O MAL FORMATEADO",
          400,
        ),
      );
    }

    const camposRequeridos = [
      "id_turno",
      "item_chocolate_tanque",
      "item_corriendo",
      "moldes_llenados",
      "porcentaje_singles_banda",
      "porcentaje_tanque_morcos",
      "temper_unit_libras",
      "porcentaje_tanque_pti",
      "hopper_libras",
      "porcentaje_chocolate_piso",
      "total_peso_palet",
      "bandejas_con_chocolate",
      "producto_terminado_proceso",
      "total_chocolate_sistema",
    ];

    // VERIFICAMOS SI LOS CAMPOS OBLIGATORIOS ESTÁN PRESENTES
    if (camposRequeridos.some((campo) => req.body[campo] === undefined)) {
      return next(
        new AppError(
          "FALTAN CAMPOS CRÍTICOS OBLIGATORIOS EN EL REPORTE DIARIO",
          400,
        ),
      );
    }

    // VERIFICAMOS QUE LOS NÚMEROS SEAN REALMENTE VALORES VÁLIDOS
    const camposNumericos = camposRequeridos.filter(
      (campo) => !["id_turno", "item_chocolate_tanque", "item_corriendo"].includes(campo),
    );

    if (camposNumericos.some((campo) => typeof req.body[campo] !== "number")) {
      return next(
        new AppError(
          "LOS CAMPOS NUMÉRICOS DEL REPORTE DIARIO DEBEN SER VALORES NUMÉRICOS",
          400,
        ),
      );
    }

    // SI TODO ESTÁ CORRECTO PASA AL CONTROLADOR
    next();
  }
}

module.exports = ControlesValidator;
