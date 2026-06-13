const express = require("express");
const router = express.Router();
const ProductosController = require("../controllers/productos.controller");
const { requerirAutenticacion } = require("../middlewares/auth.middleware");
const { requerirRol } = require("../middlewares/role.middleware");

router.get("/", ProductosController.listarProductos);
router.post("/", requerirAutenticacion, requerirRol("admin"), ProductosController.crearProducto);

router.get("/:item", ProductosController.buscarProducto);
router.put("/:item", requerirAutenticacion, requerirRol("admin"), ProductosController.actualizarProducto);
router.delete("/:item", requerirAutenticacion, requerirRol("admin"), ProductosController.eliminarProducto);

module.exports = router;
