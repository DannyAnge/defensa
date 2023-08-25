const express = require("express");
const router = express.Router();

const {
    guardar,
    editar,
    actualizar,
    getProductos,
    eliminar,
    getCategorias,
    getMarcas,
    isExisteCodBarra,
    productosMinStock
} = require('../models/productos.model')

const {isLoggedIn} = require('../lib/auth')

router.post("/productos/guardar",isLoggedIn,  guardar);

router.post("/productos/actualizar",isLoggedIn,  actualizar);

router.post("/productos/editar",isLoggedIn,  editar);

router.post("/productos/getProductos",isLoggedIn,  getProductos);

router.post("/productos/eliminar",isLoggedIn,  eliminar);

router.get('/productos/getCategorias',isLoggedIn,  getCategorias)

router.get('/productos/getMarcas',isLoggedIn,  getMarcas)

router.post('/productos/codBarra',isLoggedIn,  isExisteCodBarra)

router.get('/productos/minStock',isLoggedIn, productosMinStock)

module.exports = router;
