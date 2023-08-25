const express = require('express')
const router = express.Router();
const {guardar,editar,actualizar,eliminar,getMarcas} = require('../models/marcas.model')
const {isLoggedIn} = require('../lib/auth')

router.post('/marcas/guardar',isLoggedIn, guardar)
router.post('/marcas/editar',isLoggedIn, editar)
router.delete('/marcas/eliminar',isLoggedIn, eliminar)
router.put('/marcas/actualizar',isLoggedIn, actualizar)
router.post('/marcas/getMarcas', isLoggedIn,getMarcas)

module.exports = router;