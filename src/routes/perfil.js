const express = require('express')
const router = express.Router();
const { render } = require('ejs')
const {isLoggedIn} = require('../lib/auth')

const { guardar, mostrar } = require('../models/perfil.model')

router.post('/perfil/guardar',isLoggedIn,  guardar);
router.get('/perfil/mostrar',isLoggedIn,  mostrar);

module.exports = router;