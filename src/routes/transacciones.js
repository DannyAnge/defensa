const express = require("express");
const router = express.Router();

const {
  guardar,
  editar,
  actualizar,
  eliminar,
  mostrar,
} = require("../models/transacciones.model");
const {isLoggedIn} = require('../lib/auth')

router.post("/transacciones/guardar",isLoggedIn,  guardar);
router.post("/transacciones/editar",isLoggedIn,  editar);
router.put("/transacciones/actualizar",isLoggedIn,  actualizar);
router.delete("/transacciones/eliminar",isLoggedIn,  eliminar);
router.post("/transacciones/mostrar",isLoggedIn,  mostrar);

module.exports = router;
