class Facturacion {
  constructor() {
    this.id;
    this.idproducto;
    this.fecha;
    this.comprador;
    this.tipoVenta;
    this.iva;
    this.total = 0;
    this.usuario;
    this.codigoBarra;
    this.importe;
    this.cantidad;
    this.listaProductos = [];
    this.listaIds = [];
    this.isExiste;
    this.banderin = true;
    this.numeroFacturaStart();
    this.date = moment().format("yyyy-MM-DD");
    /* variable para capturar atributo btn */
    this.btn;
    this.formBuscar = document.getElementById("form-facturacion");
    this.formDatosFacturacion = document.getElementById(
      "form-datos-facturacion"
    );

    document.getElementById("fechaFactura").value = this.date;
  }

  getProductoPorNombre(dato) {
    fetch("/facturacion/busquedaPorNombre", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        dato: dato,
      }),
    })
      .then((list) => list.json())
      .then((list) => {
        let template = "";
        list.map((producto) => {
          template += `<tr codBarra="${producto.codigoBarra}" btn="add">
                          <td>${producto.nombre}</td>
                          <td>${producto.precioVenta}</td>
                          <td>${producto.stock}</td>
                      </tr>`;
        });
        document.getElementById("tblProductosFacturacion").innerHTML = template;
      })
      .catch();
  }

  setDatosFacturacion() {
    let data = new FormData(this.formDatosFacturacion);
    this.id = document.getElementById("numeroFactura").value;
    this.tipoVenta = data.get("formaPago");
    this.comprador = data.get("comprador");
    this.fecha = data.get("fecha");
    this.setDatosDetalles(this.id);
  }

  setDatosDetalles(factura) {
    this.listaProductos.map((p) => {
      p.cantidadProducto = document.getElementById(
        `cantidadProducto${p.producto}`
      ).innerText;
      p.factura = factura;
      p.totalVenta =
        parseFloat(p.precioProducto) * parseFloat(p.cantidadProducto);
    });
  }

  guardarFactura() {
    fetch("/facturacion/guardar", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        formaPago: this.tipoVenta,
        comprador: this.comprador,
        fecha: this.fecha,
        total: this.total,
        detalles: this.listaProductos,
      }),
    })
      .then((message) => message.json())
      .then(async (message) => {
        await swal.fire({
          title:'Exito',
          icon: 'success',
          timer:1000
        }) 
        document.getElementById("numeroFactura").value = message.factura;
        this.limpiar();
        this.ticket();
        document.getElementById("fechaFactura").value = this.date;
      })
      .catch(error=>{
        console.log(error)
      });
  }

  limpiar() {
    this.listaProductos.map((producto) => {
      this.agregarInventario(
        producto.producto,
        document.getElementById(`cantidadProducto${producto.producto}`)
          .innerText
      );
    });
    this.total = 0;
    this.listaIds = [];
    this.listaProductos = [];
    this.formBuscar.reset();
    document.forms["form-datos-facturacion"]["comprador"].value = "";
    document.getElementById("table-facturacion").innerHTML = "";
    document.getElementById("totalFactura").innerText = "0.00";
    document.getElementById("fechaFactura").value =
      moment().format("yyyy-MM-DD");
  }

  comprobarProductoFactura(params) {
    let i = this.listaIds.filter((producto) => producto == params);
    if (i.length > 0) {
      this.isExiste = true;
    } else {
      this.isExiste = false;
    }
  }

  /*
    FUNCION PARA AGREGAR PRODUCTO POR CODIGO DE BARRA A UNA MISMA FILA
  */
  addProduct(params) {
    this.cantidad = document.getElementById(
      `cantidadProducto${params.id}`
    ).innerText;
    this.cantidad = parseFloat(this.cantidad) + 1;
    this.precioVenta = document.getElementById(`precio${params.id}`).innerText;
    this.importe = this.cantidad * this.precioVenta;
    document.getElementById("importe" + params.id).innerText = this.importe;
    document.getElementById(`cantidadProducto${params.id}`).innerText =
      this.cantidad;
    this.calcularTotalFactura();
  }

  agregarProducto() {
    let data = new FormData(this.formBuscar);
    if (this.banderin) {
      this.codigoBarra = data.get("codigoBarraFacturacion");
    }
    fetch("/facturacion/getProducto", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        codigoBarra: this.codigoBarra,
        cantidad: 1,
      }),
    })
      .then((producto) => producto.json())
      .then((producto) => {
        if (producto.message != undefined) {
          Swal.fire({
            title: "Error!",
            text: producto.message,
            icon: "error",
          });
        } else {
          this.calculos(producto[0]);
          this.formBuscar.reset();
        }
      })
      .catch();
  }

  calculos(params) {
    let row = document.createElement("tr");
    let col;
    let table = document.getElementById("table-facturacion");
    this.comprobarProductoFactura(params.id);
    row.setAttribute("id", params.id);
    if (!this.isExiste) {
      this.listaIds.push(params.id);
      this.listaProductos.push({
        productoName: params.nombre,
        producto: params.id,
        precioProducto: params.precioVenta,
      });
      col = `
                <td>
                  <button class="icon-trash btn btn-danger btn-sm" btn="eliminarProductoFacturacion"></button>
                  <button class="btn btn-success btn-sm" btn="addproducto">+</button>
                 <i class="icon-plus" style="color:green" btn="btnAgregarMasProducto"></i>
                </td>
                <td>${params.codigoBarra}</td>
                <td id="${"cantidadProducto" + params.id}" >
                    1  
                </td>
                <td>${params.nombre} ${
        params.nombreMarca != "--sin marca--" ? params.nombreMarca : ""
      }</td>
                <td id="precio${params.id}">${params.precioVenta}</td>
                <td id="importe${params.id}">${params.precioVenta}</td>
    `;
      row.innerHTML = col;
      table.append(row);
      this.calcularTotalFactura();
    } else {
      this.addProduct(params);
    }
  }

  calcularTotalFactura() {
    this.total = 0;
    this.listaIds.forEach((producto) => {
      this.total += parseFloat(
        document.getElementById(`importe${producto}`).innerHTML
      );
    });
    document.getElementById("totalFactura").innerText = this.total;
  }

  numeroFacturaStart() {
    fetch("/facturacion/ultimaFactura")
      .then((numero) => numero.text())
      .then((numero) => {
        document.getElementById("numeroFactura").value = numero;
      })
      .catch((error) => console.log(error));
  }

  /** se borrara */
  agregarInventario(producto, cantidad) {
    console.log(cantidad, producto);
    fetch("/facturacion/agregarInventario", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ producto, cantidad }),
    })
      .then((e) => e.text())
      .then((e) => {})
      .catch((error) => console.log(error));
  }

  /** se borrara */
  addProductoBoton(cantidad) {
    /*fetch("/facturacion/venderId", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        producto: this.idproducto,
        cantidad: cantidad,
      }),
    })
      .then((message) => message.json())
      .then((message) => {*/
          this.cantidad = document.getElementById(
            `cantidadProducto${this.idproducto}`
          ).innerText;
          this.cantidad = parseFloat(this.cantidad) + parseFloat(cantidad);
          this.precioVenta = document.getElementById(
            `precio${this.idproducto}`
          ).innerText;
          this.importe = this.cantidad * this.precioVenta;
          document.getElementById("importe" + this.idproducto).innerText =
            this.importe;
          document.getElementById(
            `cantidadProducto${this.idproducto}`
          ).innerText = this.cantidad;
          this.calcularTotalFactura();
        
      //});
  }

  ticket() {
    window.open("http://localhost:3000/facturacion/ticket");
  }
}

/*--------------------------------------------------------------------------------------*/
var factura = new Facturacion();

document.getElementById("form-facturacion").addEventListener("submit", (e) => {
  e.preventDefault();
  factura.agregarProducto();
});

document
  .getElementById("btnAgregarProductoFactura")
  .addEventListener("click", () => {
    factura.agregarProducto();
  });

document
  .getElementById("table-facturacion")
  .addEventListener("click", async (e) => {
    factura.btn = e.target.getAttribute("btn");
    /** Eliminar producto de tabla de facturacion */
    if (factura.btn === "eliminarProductoFacturacion") {
      factura.idproducto =
        e.target.parentElement.parentElement.getAttribute("id");
      factura.listaIds.find((id, i) => {
        if (id == factura.idproducto) {
          factura.listaIds.splice(i, 1);
        }
      });
      factura.listaProductos.find((detalle, index) => {
        try {
          if (detalle.producto == factura.idproducto) {
            factura.listaProductos.splice(index, 1);
            e.target.parentElement.parentElement.remove();
          }
        } catch (error) {
          console.log(error);
        }
      });
      factura.calcularTotalFactura();
    } else if (factura.btn == "addproducto") {
      factura.idproducto =
        e.target.parentElement.parentElement.getAttribute("id");
      let { value: cantidad } = await swal.fire({
        title: "Agregar",
        input: "number",
        inputLabel: "Cantidad:",
        inputPlaceholder: "Cant.",
      });
      if (cantidad) {
        factura.addProductoBoton(cantidad);
      }
    }
  });

document.getElementById("btnGuardarFactura").addEventListener("click", () => {
  factura.setDatosFacturacion();
  factura.guardarFactura();
});

document.getElementById("buscarPorNombre").addEventListener("keyup", () => {
  factura.getProductoPorNombre(
    document.getElementById("buscarPorNombre").value
  );
});

document
  .getElementById("tblProductosFacturacion")
  .addEventListener("click", (e) => {
    factura.banderin = false;
    factura.codigoBarra = e.target.parentElement.getAttribute("codBarra");
    if (factura.codigoBarra !== "") {
      factura.agregarProducto();
      factura.banderin = true;
    }
  });

document.getElementById("btnLimpiarFactura").addEventListener("click", () => {
  factura.limpiar();
});
