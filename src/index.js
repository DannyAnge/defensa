const express = require("express");
const { render } = require("ejs");
const path = require("path");
const passport = require('passport')
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const MySQLStore = require("express-mysql-session");
//INICIALIZAMOS EXPRESS
const app = express();
require("./lib/passport");

app.set("port", process.env.PORT || 3000);
//decirle al server donde estaran las vistas
app.set("views", path.join(__dirname + "/views"));
//dcirle al server que extencion usaran las vistas
app.engine("html", require("ejs").renderFile);
//decirle al server que motor de plantilla usara
app.set("view engine", "ejs");

//para recibir objetos json mediante post
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser("mySecretKey"));
app.use(flash());
//siempre usar session antes de passport
app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({
    host: "localhost",
    user: "root",
    password: "19199697tsoCD",
    database: 'dreamangelshop'
}),
  })
);
app.use(passport.initialize());
app.use(passport.session());

//archivos publicos
app.use(express.static(path.join(__dirname + "/public")));

//variables globales
app.use((req, res, next) => {
  app.locals.success = req.flash("success");
  app.locals.message = req.flash("message");
  app.locals.user = req.user;
  next();
});

//controladores (manejadores) de rutas
app.use(require("./routes/index"));
app.use(require("./routes/facturacion"));
app.use(require("./routes/productos"));
app.use(require("./routes/categorias"));
app.use(require("./routes/reportes"));
app.use(require("./routes/marcas"));
app.use(require("./routes/transacciones"));
app.use(require('./routes/perfil'));
app.use(require('./routes/usuarios'));

app.listen(app.get("port"));

