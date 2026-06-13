const express = require("express");
const router = express.Router();
const UsuariosController = require("../controllers/usuarios.controller");
const { requerirAutenticacion } = require("../middlewares/auth.middleware");
const { requerirRol } = require("../middlewares/role.middleware");

router.get("/", requerirAutenticacion, requerirRol("admin"), UsuariosController.listarUsuarios);
router.post("/", UsuariosController.crearUsuario);
router.get("/:id", requerirAutenticacion, requerirRol("admin"), UsuariosController.buscarUsuario);
router.put("/:id", requerirAutenticacion, requerirRol("admin"), UsuariosController.actualizarUsuario);
router.delete("/:id", requerirAutenticacion, requerirRol("admin"), UsuariosController.eliminarUsuario);

module.exports = router;
