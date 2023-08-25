module.exports = {
    isLoggedIn(req, res, next){
        //si esta loggeado peude ver la direccion
        if(req.isAuthenticated()){
            return next();
        }
        //si no no puede pasar del login
        return res.redirect('/');
    },
    isNotLoggedIn(req, res, next){
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/menu');
    }
}