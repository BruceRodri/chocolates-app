const express = require("express");
const router = express.Router();
const ControlesController = require("../controllers/controles.controller");
// IMPORTAMOS EL VALIDADOR DE ENTRADA
const ControlesValidator = require("../validators/controles.validator");
const { requerirAutenticacion } = require("../middlewares/auth.middleware");

router.get("/balance", requerirAutenticacion, ControlesController.listarBalances);
router.get("/balance/:id", requerirAutenticacion, ControlesController.buscarBalance);

//VALIDADOR ANTES DEL CONTROLADOR EN LA RUTA POST
router.post(
  "/",
  requerirAutenticacion,
  ControlesValidator.validarNuevoControl,
  ControlesController.guardarControl,
);
router.put("/:id", requerirAutenticacion, ControlesController.actualizarControl);
router.delete("/:id", requerirAutenticacion, ControlesController.eliminarControl);

module.exports = router;
