const conexion = require("../conexion");

const guardar = async (req, res) => {
  try {
    const result = await conexion.query("INSERT INTO usuarios SET ?", [
      req.body,
    ]);
    if (result.affectedRows > 0) {
      res.send({ message: "Usuario creado con exito.." });
    } else {
      res.send({
        message: "Oops.. ocurrio un error al intentar crear el usuario.",
      });
    }
  } catch (error) {
    res.send({
      message: "Oops.. ocurrio un error al intentar crear el usuario.",
    });
    console.log(error);
  }
};

const actualizar = async (req, res) => {
  const { id, nombreUsuario, password, permiso } = req.body;
  try {
    const result = await conexion.query(
      "UPDATE usuarios SET nombreUsuario = ?, password = ?, permiso = ? WHERE id = ?",
      [nombreUsuario, password, permiso, id]
    );
    if (result.affectedRows > 0) {
      res.send({ message: "Usuario actualizado con exito.." });
    } else {
      res.send({
        message: "Oops.. ocurrio un error al intentar actualizar el usuario.",
      });
    }
  } catch (error) {
    res.send({
      message: "Oops.. ocurrio un error al intentar actualizar el usuario.",
    });
    console.log(error);
  }
};

const editar = async (req, res) => {
  try {
    const id = req.params.id;
    const [user] = await conexion.query("SELECT * FROM usuarios WHERE id = ?", [
      id,
    ]);
    res.send(user);
  } catch (error) {
    console.log(erro);
  }
};

const eliminar = async (req, res) => {
  try {
    const id = req.params.id;
    if (id != req.user.id) {
      const result = await conexion.query("DELETE FROM usuarios WHERE id = ?", [
        id,
      ]);
      if (result.affectedRows && result.affectedRows > 0) {
        res.send({
          message: "Usuario eliminado con exito.",
          icon: "success",
          title: "Exito.",
        });
      } else {
        res.send({
          message: "Oops.. ocurrio un error al intentar eliminar el usuario",
          icon: "error",
          title: "Error!",
        });
      }
    } else {
      res.send({
        message: `No se puede eliminar el usuario ${req.user.nombreUsuario} por que esta en uso.`,
        icon: "error",
        title: "Error!",
      });
    }
  } catch (error) {
    res.send({
      message: "Oops.. ocurrio un error al intentar eliminar el usuario",
      icon: "error",
      title: "Error!",
    });
    console.log(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const list = await conexion.query(
      "SELECT * FROM usuarios WHERE nombreUsuario LIKE ? ORDER BY nombreUsuario ASC",
      ["%" + req.body.valor + "%"]
    );
    res.send(list);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  guardar,
  actualizar,
  editar,
  eliminar,
  getUsers,
};
