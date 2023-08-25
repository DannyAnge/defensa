const { render } = require("ejs");
const conexion = require("../conexion");

const guardar = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    await conexion.query("INSERT INTO categorias set ?", [
      { nombre, descripcion },
    ]);
  } catch (error) {
    console.log(error);
  }
  res.send("Categoria guardada cpon exito..");
};

const getCategorias = async (req, res) => {
  let data;
  const {categoria} = req.body;
  try {
    data = await conexion.query("SELECT * FROM categorias WHERE nombre LIKE ? ORDER BY id DESC LIMIT 15",['%'+categoria+'%']);
  } catch (error) {
    console.log(error);
  }
  res.send(data);
};

const editar = async (req,res) => {
  try {
    const {id} = req.body;
    const info = await conexion.query("SELECT * FROM categorias WHERE id = ?", [
      id,
    ]);
    res.send(info);
  } catch (error) {
    console.log(error);
  }
};

const actualizar = async(req,res)=>{
  try {
    const {id,nombre,descripcion} = req.body;
    const update = await conexion.query("UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?",[nombre,descripcion,id]);
    if(update){
      res.send("Categoria actualizada con exito.")
    }else{
      res.send("OOps.. Ocurrio un error al intentar actualizar la categoria.");
    }
  } catch (error) {
   console.log(error); 
  }
}

const eliminar = async (req,res)=>{
  try {
    const {id} = req.body;
    await conexion.query("DELETE FROM categorias WHERE id = ?",[id]) 
    res.send("Categoria eliminada con exito.")
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
    guardar,
    getCategorias,
    editar,
    actualizar,
    eliminar
}