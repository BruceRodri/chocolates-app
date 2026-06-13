const express = require("express");
const router = express.Router();

// IMPORTAMOS TODAS LAS RUTAS INDIVIDUALES
const usuariosRoutes = require("./usuarios.routes");
const authRoutes = require("./auth.routes");
const productosRoutes = require("./productos.routes");
const controlesRoutes = require("./controles.routes");
const tiposChocolateRoutes = require("./tiposChocolate.routes");
const tanquesRoutes = require("./tanques.routes");
const stockRoutes = require("./stock.routes");

//ENLAZAMOS CADA RUTA CON SU PREFIJO CORRESPONDIENTE
router.use("/auth", authRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/productos", productosRoutes);
router.use("/controles", controlesRoutes);
router.use("/tipos-chocolate", tiposChocolateRoutes);
router.use("/tanques", tanquesRoutes);
router.use("/stock", stockRoutes);

//EXPORTAMOS ESTE ENRUTADOR MAESTRO
module.exports = router;
