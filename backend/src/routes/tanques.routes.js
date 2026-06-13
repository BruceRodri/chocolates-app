const express = require("express");
const router = express.Router();
const TanquesController = require("../controllers/tanques.controller");
const { requerirAutenticacion } = require("../middlewares/auth.middleware");
const { requerirRol } = require("../middlewares/role.middleware");

router.get("/", TanquesController.listarTanques);
router.post("/", requerirAutenticacion, requerirRol("admin"), TanquesController.crearTanque);
router.get("/:nombre", TanquesController.buscarTanque);
router.put("/:nombre", requerirAutenticacion, requerirRol("admin"), TanquesController.actualizarTanque);
router.delete("/:nombre", requerirAutenticacion, requerirRol("admin"), TanquesController.eliminarTanque);

module.exports = router;
