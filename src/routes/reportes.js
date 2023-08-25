const express = require("express");
const router = express.Router();

const { reporteDiario,getFacturas,getFactura,getDetallesFactura,devoluciones } = require("../models/reportes.model");
const {isLoggedIn} = require("../lib/auth")

router.post("/reportes/ventaDiaria",isLoggedIn, reporteDiario);

router.post('/reportes/getFacturas',isLoggedIn, getFacturas)

router.post('/reportes/getFactura',isLoggedIn, getFactura)

router.post('/reportes/getDetallesFactura',isLoggedIn, getDetallesFactura)

router.post('/reportes/devoluciones',isLoggedIn, devoluciones)

module.exports = router;
