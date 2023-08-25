const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const conexion = require('../conexion');
const helpers = require('../lib/helpers');
const flash = require('connect-flash/lib/flash');

passport.use('local.login', new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password',
    passReqToCallback: true
},async (req, userName, password, done)=>{
    console.log(userName)
    const rows = await conexion.query("SELECT * FROM usuarios WHERE nombreUsuario = ?",[userName]);
    if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.validar(password, user.password);
        if(validPassword){
            return done(null, user);
        }else{
            return done(null, false, req.flash('message','Contraseña Incorrecta'));
        }
    }else{
        return done(null, false, req.flash('message', 'Usuario no existe.'));
    }
}));

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser( async (id , done)=>{
    const rows = await conexion.query("SELECT * FROM usuarios WHERE id = ?",[id]);
    done(null, rows[0]);
});