const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const { requerirAutenticacion } = require("../middlewares/auth.middleware");

router.post("/login", AuthController.login);
router.get("/me", requerirAutenticacion, AuthController.me);

module.exports = router;
