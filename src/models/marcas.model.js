const conexion = require("../conexion");

const guardar = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    let save = await conexion.query("INSERT INTO marca set ?", [
      { nombre, descripcion },
    ]);
    res.send("Marca guadada con exito.");
  } catch (error) {
    console.log(error);
  }
};

const editar = async (req, res) => {
  try {
    const { id } = req.body;
    let marca = await conexion.query("SELECT * FROM marca WHERE id = ?", [id])
    res.send(marca)
  } catch (error) {
    console.log(error)
  }
};

const actualizar = async (req, res) => {
  try {
    const { id, nombre, descripcion } = req.body;
    let update = await conexion.query("UPDATE marca SET nombre = ?, descripcion = ? WHERE id = ?", [nombre, descripcion, id]);
    if (update) {
      res.send("Marca actualizada con exito.")
    }
  } catch (error) {
    console.log(error)
  }
};

const eliminar = async (req, res) => {
  try {
    const { id} = req.body;
    let eliminar = await conexion.query("DELETE FROM marca WHERE id = ?", [id]);
    if (eliminar) {
      res.send("Marca eliminada con exito.")
    }
  } catch (error) {
    console.log(error)
  }
};

const getMarcas = async (req, res) => {
  try {
    const { valor } = req.body;
    const marcas = await conexion.query(
      "SELECT * FROM marca WHERE nombre LIKE ? LIMIT 15",
      ["%" + valor + "%"]
    );
    res.send(marcas);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  guardar,
  editar,
  actualizar,
  eliminar,
  getMarcas,
};
