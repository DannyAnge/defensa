const conexion = require("../conexion");

const guardar = async (req, res) => {
  try {
    const {
      codigoBarra,
      nombre,
      precioCompra,
      precioVenta,
      stock,
      categoria,
      marca,
      descripcion,
    } = req.body;
    let newUser = {
      codigoBarra: codigoBarra,
      nombre: nombre,
      precioCompra: parseFloat(precioCompra),
      precioVenta: precioVenta,
      stock: stock,
      categoria: categoria,
      marca: marca,
      descripcion: descripcion,
    };
    await conexion.query("INSERT INTO productos set ?", [newUser]);
    res.send("Productos guardados con exito");
  } catch (error) {
    console.log(error);
  }
};

const actualizar = async (req, res) => {
  try {
    const {
      codigoBarra,
      nombre,
      precioCompra,
      precioVenta,
      stock,
      categoria,
      marca,
      descripcion,
      id,
    } = req.body;

    await conexion.query(
      `UPDATE productos SET codigoBarra = ?, nombre = ?, precioCompra = ?, precioVenta = ?, stock = ?, categoria = ?, marca = ?, descripcion = ? WHERE id = ?`,
      [
        codigoBarra,
        nombre,
        precioCompra,
        precioVenta,
        stock,
        categoria,
        marca,
        descripcion,
        id,
      ]
    );
    res.send("Productos actualizado con exito");
  } catch (error) {
    console.log(error);
  }
};

const editar = async (req, res) => {
  try {
    const { producto } = req.body;
    let infoProducto = await conexion.query(
      "SELECT * FROM productos WHERE id = ?",
      [producto]
    );
    res.send(infoProducto);
  } catch (error) {
    console.log(error);
  }
};

const getProductos = async (req, res) => {
  try {
    const { valor } = req.body;
    const productos = await conexion.query(
      "SELECT p.id,codigoBarra,p.nombre,precioCompra,precioVenta,stock,c.nombre AS categoria ,m.nombre AS marca,p.descripcion FROM productos AS p INNER JOIN categorias AS c ON(p.categoria=c.id) INNER JOIN marca AS m ON(p.marca=m.id) WHERE CONCAT(p.nombre,p.codigoBarra,m.nombre,c.nombre) LIKE ? ORDER BY id DESC LIMIT 20",
      ["%" + valor + "%"]
    );
    res.send(productos);
  } catch (error) {
    console.log(error);
  }
};

const eliminar = async (req, res) => {
  try {
    const { producto } = req.body;
    await conexion.query("DELETE FROM productos WHERE id = ?", [producto]);
  } catch (error) {
    console.log(error);
  }
  res.send("producto eliminado con exito.");
};

const getCategorias = async (req, res) => {
  try {
    let categorias = await conexion.query("SELECT * FROM categorias");
    res.send(categorias);
  } catch (error) { }
};

const getMarcas = async (req, res) => {
  try {
    let marcas = await conexion.query("SELECT * FROM marca");
    res.send(marcas);
  } catch (error) {
    console.log(error);
  }
};

const isExisteCodBarra = async (req, res) => {
  try {
    const { codigoBarra } = req.body;
    let isExiste;
    let codigo = await conexion.query(
      "SELECT codigoBarra FROM productos WHERE codigoBarra = ?",
      [codigoBarra]
    );
    codigo.map((c) => {
      if (codigo[0].codigoBarra !== "") {
        isExiste = true;
      } else {
        isExiste = false;
      }
    });

    res.send({ isExiste: isExiste });
  } catch (error) {
    console.log(error);
  }
};

const productosMinStock = async (req,res)=>{
  try {
   const list = await conexion.query("SELECT * FROM productos WHERE stock = 0");
   res.send(list); 
  } catch (error) {
   console.log(error) 
  }
}

module.exports = {
  guardar,
  actualizar,
  editar,
  getProductos,
  eliminar,
  getCategorias,
  getMarcas,
  isExisteCodBarra,
  productosMinStock
};
