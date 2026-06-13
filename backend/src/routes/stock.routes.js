const express = require("express");
const router = express.Router();
const StockController = require("../controllers/stock.controller");
const { requerirAutenticacion } = require("../middlewares/auth.middleware");
const { requerirRol } = require("../middlewares/role.middleware");

router.get("/", StockController.listar);
router.post("/", requerirAutenticacion, StockController.crear);
router.get("/:id", StockController.buscar);
router.put("/:id", requerirAutenticacion, requerirRol("admin"), StockController.actualizar);
router.delete("/:id", requerirAutenticacion, requerirRol("admin"), StockController.eliminar);

module.exports = router;
