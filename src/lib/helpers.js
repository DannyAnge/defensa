
const helpers = {};

helpers.validar = (password, savedPassword)=>{
    if(password === savedPassword){
        return true;
    }
    else{
        return false;
    }
}

module.exports = helpers;
