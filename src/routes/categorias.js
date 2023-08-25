const express = require("express");
const router = express.Router();

const {
  guardar,
  editar,
  getCategorias,
  actualizar,
  eliminar
} = require("../models/categorias.model");

const {isLoggedIn} = require('../lib/auth')

router.post("/categorias/guardar",isLoggedIn,  guardar);

router.post("/categorias/getCategorias",isLoggedIn,  getCategorias);

router.post("/categorias/editar",isLoggedIn,  editar);

router.post('/categorias/actualizar',isLoggedIn, actualizar)

router.put('/categorias/eliminar',isLoggedIn, eliminar)

module.exports = router;
