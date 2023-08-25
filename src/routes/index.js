const express = require("express");
const router = express.Router();
const { render } = require("ejs");
const conexion = require("../conexion");

const passport = require('passport');
const { authenticate } = require("passport");
const {isLoggedIn,isNotLoggedIn} = require('../lib/auth')

router.get('/',isNotLoggedIn,(req,res)=>{
  res.render('index.html')
})

router.post("/login", async (req, res, next) => {
  const { userName, password } = req.body;
  passport.authenticate("local.login", {
    successRedirect: "/menu",
    failureRedirect: "/",
    failureFlash: true,
  })(req, res, next);
});

router.get('/logout',(req,res,next)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get("/menu",isLoggedIn, (req, res) => {
  try {
    res.render("spa.html");
  } catch (error) {
    console.log(error);
  }
});

router.get('/inventario', isLoggedIn, (req, res) => {
  res.render("inventario.html")
})

router.get('/reportes', isLoggedIn,(req, res) => {
  res.render("reportes.html");
})

router.get('/usuarios', isLoggedIn,(req, res) => {
  res.render('usuarios.html')
})

router.get('/transacciones',isLoggedIn, (req, res) => {
  res.render('transacciones.html')
})

router.get('/perfil',isLoggedIn, (req, res) => {
  res.render('perfil.html')
})

module.exports = router;
