const { render } = require('ejs')
const conexion = require('../conexion')

const guardar = async (req, res) => {
    try {
        const { nombre, direccion, mensaje, telefono } = req.body;
        await conexion.query("UPDATE perfil SET nombre=?,direccion=?,mensaje=?,telefono=? WHERE id = ?", [nombre, direccion, mensaje, telefono, 1]);
        res.send("Perfil agregado con exito.")
    } catch (error) {
        console.log(error)
    }
}

const mostrar = async (req, res) => {
    try {
        let perfil = await conexion.query("SELECT * FROM perfil");
        res.send(perfil)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    guardar,
    mostrar
}