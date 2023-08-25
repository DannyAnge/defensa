const express = require("express");
const router = express.Router()

const {isLoggedIn} = require('../lib/auth');
const {guardar,actualizar,editar, getUsers, eliminar} = require('../models/usuarios.model');

router.post('/usuarios/guardar',isLoggedIn,guardar);
router.get('/usuarios/editar/:id',isLoggedIn,editar);
router.post('/usuarios/actualizar',isLoggedIn,actualizar)
router.post('/usuarios/getUsers',isLoggedIn,getUsers)
router.delete('/usuarios/eliminar/:id',isLoggedIn,eliminar)

module.exports = router;