const conexion = require("../conexion");

const guardar = async (req, res) => {
  try {
    const { fecha, tipoTransaccion, monto, descripcion } = req.body;
    await conexion.query("INSERT INTO transaccion SET ?", [
      { fecha, tipoTransaccion, monto, descripcion },
    ]);
    res.send("Movimiento realizado con exito.");
  } catch (error) {
    console.log(error);
  }
};

const editar = async (req, res) => {
  try {
    const { id } = req.body;
    let info = await conexion.query("SELECT * FROM transaccion WHERE id = ?", [
      id,
    ]);
    res.send(info);
  } catch (error) {
    console.log(error);
  }
};

const actualizar = async (req, res) => {
  try {
    const { fecha, tipoTransaccion, monto, anotaciones, id } = req.body;
    await conexion.query(
      "UPDATE transaccion SET fecha = ?, tipoTransaccion= ?, monto = ?, descripcion = ? WHERE id = ?",
      [fecha, tipoTransaccion, monto, anotaciones, id]
    );
    res.send("Movimiento actualizado con exito.");
  } catch (error) {
    console.log(error);
  }
};

const eliminar = async (req, res) => {
  try {
    const { id } = req.body;
    await conexion.query("DELETE FROM transaccion WHERE id = ?", [id]);
    res.send("Movimiento eliminado con exito.");
  } catch (e) {
    console.log(error);
  }
};

const mostrar = async (req, res) => {
  try {
    const { value } = req.body;
    let transacciones = await conexion.query(
      "SELECT * FROM transaccion WHERE CONCAT(fecha,tipoTransaccion) LIKE ? ORDER BY fecha DESC LIMIT 10",
      ["%" + value + "%"]
    );
    res.send(transacciones);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  guardar,
  editar,
  actualizar,
  eliminar,
  mostrar,
};
