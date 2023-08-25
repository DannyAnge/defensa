const { render } = require("ejs");
const conexion = require("../conexion");
const { route } = require("../routes");

var ventas, ingresos, egresos;

const reporteDiario = async (req, res) => {
  try {
    const { fecha1, fecha2 } = req.body;
    ventas = await ventaDiaria(fecha1, fecha2);
    ingresos = await ingresoEfectivoDiario(fecha1, fecha2);
    egresos = await egresoEfectivoDiario(fecha1, fecha2);
    let datos = {};
    datos.ventaDiaria = ventas;
    datos.ingresoEfectivo = ingresos;
    datos.egresoEfectivo = egresos;
    datos.existenciaCaja = existenciaCaja(ventas, ingresos, egresos);
    res.send(datos);
  } catch (error) {
    console.log(error);
  }
};

const getFacturas = async (req, res) => {
  try {
    const { fecha } = req.body;
    const facturas = await conexion.query(
      "SELECT * FROM facturas WHERE DATE(fecha) = ? ORDER BY id DESC",
      [fecha]
    );
    res.send(facturas);
  } catch (error) {
    console.log(error);
  }
};

const getFactura = async (req, res) => {
  try {
    const { id } = req.body;
    let factura = await conexion.query("SELECT * FROM facturas WHERE id=?", [
      id,
    ]);
    res.send(factura);
  } catch (error) {
    console.log(error);
  }
};

const getDetallesFactura = async (req, res) => {
  try {
    const { factura } = req.body;
    let detalles = await conexion.query(
      "SELECT d.id,d.cantidadProducto,d.producto,p.nombre,d.precioProducto,d.totalVenta,d.factura FROM detalleFactura AS d INNER JOIN productos AS p ON(d.producto=p.id) WHERE d.factura = ?",
      [factura]
    );
    res.send(detalles);
  } catch (error) {
    console.log(error);
  }
};

const ventaDiaria = async (fecha1, fecha2) => {
  let venta;
  let getVenta = await conexion.query(
    "SELECT SUM(totalFactura) AS total FROM facturas WHERE fecha BETWEEN ? AND ?",
    [fecha1, fecha2]
  );
  if (getVenta[0].total !== null) {
    venta = parseFloat(getVenta[0].total).toFixed(2);
  } else {
    venta = 0.0;
  }
  return venta;
};

const ingresoEfectivoDiario = async (fecha1,fecha2) => {
  let ingreso;
  let getIngresos = await conexion.query(
    "SELECT SUM(monto) AS total FROM transaccion WHERE fecha BETWEEN ? AND ? AND tipoTransaccion = 'Ingreso'",
    [fecha1, fecha2]
  );
  if (getIngresos[0].total !== null) {
    ingreso = parseFloat(getIngresos[0].total).toFixed(2);
  } else {
    ingreso = 0.0;
  }
  return ingreso;
};

const egresoEfectivoDiario = async (fecha1, fecha2) => {
  let egreso;
  let getEgresos = await conexion.query(
    "SELECT SUM(monto) AS total FROM transaccion WHERE fecha BETWEEN ? AND ? AND tipoTransaccion = 'Egreso'",
    [fecha1,fecha2]
  );
  if (getEgresos[0].total !== null) {
    egreso = parseFloat(getEgresos[0].total).toFixed(2);
  } else {
    egreso = 0.0;
  }
  return egreso;
};

const existenciaCaja = (ventas, ingresos, egresos) => {
  let total = parseFloat(ventas) + parseFloat(ingresos) - parseFloat(egresos);
  return total.toFixed(2);
};

const devoluciones = async (req, res) => {
  try {
    const { detalle, cantidad, producto, precio, factura } = req.body;
    await conexion.query(
      "UPDATE detalleFactura SET cantidadProducto = cantidadProducto - ?, totalVenta = totalVenta - (?*precioProducto) WHERE id = ?",
      [cantidad, cantidad, detalle]
    );
    await conexion.query("CALL AgregarInventario(?,?)", [
      producto,
      cantidad,
    ]);
    await updateTotalFactura(factura, precio, cantidad);
    res.send("Devolucion realizada con exito.");
  } catch (error) {
    console.log(error);
  }
};

const updateTotalFactura = async (factura, precio, cantidad) => {
  try {
    let monto = cantidad * precio;
    console.log(monto);
    console.log(factura);
    await conexion.query(
      "UPDATE facturas SET totalFactura = totalFactura - ? WHERE id = ?",
      [monto, factura]
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  reporteDiario,
  getFacturas,
  getFactura,
  getDetallesFactura,
  devoluciones,
};

