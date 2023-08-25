const express = require("express");
const router = express.Router();

const {
  ultimaFactura,
  guardarFactura,
  buscarPorNombre,
  venderId,
  getProducto,
  ticket,
  agregarProductoInventario
} = require("../models/facturacion.model");
const {isLoggedIn} = require('../lib/auth')

router.get("/facturacion/ultimaFactura",isLoggedIn,  ultimaFactura);
router.post("/facturacion/guardar",isLoggedIn,  guardarFactura);
router.post("/facturacion/busquedaPorNombre",isLoggedIn,  buscarPorNombre);
router.post("/facturacion/getProducto",isLoggedIn,  getProducto);
router.get("/facturacion/ticket",  ticket);
router.post('/facturacion/venderId',isLoggedIn,  venderId)
router.post('/facturacion/agregarInventario',isLoggedIn,  agregarProductoInventario)

module.exports = router;
