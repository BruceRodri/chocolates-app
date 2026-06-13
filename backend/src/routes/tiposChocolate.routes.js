const express = require("express");
const router = express.Router();
const TiposChocolateController = require("../controllers/tiposChocolate.controller");
const { requerirAutenticacion } = require("../middlewares/auth.middleware");
const { requerirRol } = require("../middlewares/role.middleware");

router.get("/", TiposChocolateController.listarTipos);
router.post("/", requerirAutenticacion, requerirRol("admin"), TiposChocolateController.crearTipo);
router.get("/:id", TiposChocolateController.buscarTipo);
router.put("/:id", requerirAutenticacion, requerirRol("admin"), TiposChocolateController.actualizarTipo);
router.delete("/:id", requerirAutenticacion, requerirRol("admin"), TiposChocolateController.eliminarTipo);

module.exports = router;
