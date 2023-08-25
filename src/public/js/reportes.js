class Reportes {
  constructor() {
    this.fechaActual = moment().format("yyyy-MM-DD");
    this.fecha1;
    this.fecha2;
    this.numeroFactura;
    this.template = "";
    this.idfactura;
    this.form = document.getElementById("form-reporte-diario");
    document.getElementById("fecha1").value = this.fechaActual;
    document.getElementById("fecha2").value = this.fechaActual;
    moment.locale("es");
  }

  getDatos() {
    this.fecha1 = document.getElementById("fecha1").value;
    this.fecha2 = document.getElementById("fecha2").value;
    fetch("/reportes/ventaDiaria", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        fecha1: this.fecha1,
        fecha2: this.fecha2
      }),
    })
      .then((venta) => venta.json())
      .then((venta) => {
        let template = `
                        <tr>
                            <td>Ventas</td>
                            <td class='text-right'>${venta.ventaDiaria}</td>
                        </tr>
                        <tr>
                            <td>Ingresos de efectivo</td>
                            <td class='text-right'>${venta.ingresoEfectivo}</td>
                        </tr>
                        <tr>
                            <td>Egresos de efectivo</td>
                            <td class='text-right'>${venta.egresoEfectivo}</td>
                        </tr>
                        <tr class="font-weight-bold">
                            <td>Efectivon en caja</td>
                            <td class='text-right'>${venta.existenciaCaja}</td>
                        </tr>`;
        document.getElementById("tblReportes").innerHTML = template;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getFacturas() {
    this.fecha = document.getElementById("fecha-reporte-diario").value;
    fetch("/reportes/getFacturas", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        fecha: this.fecha,
      }),
    })
      .then((facturas) => facturas.json())
      .then((facturas) => {
        facturas.map((factura) => {
          this.template += `
                        <tr id="${factura.id}">
                            <td>${factura.id}</td>
                            <td>${moment(factura.fecha).format(
                              "ddd, DD-MMM-yyyy"
                            )}</td>
                            <td>${factura.nombre_comprador}</td>
                            <td>${parseFloat(factura.totalFactura).toFixed(
                              2
                            )}</td>
							<td>
                              <button class="fa fa-edit btn btn-info btn-sm" btn="btnDetallesFactura" data-target="#modalDetalles" data-toggle="modal"></button>
							</td>
                        </tr>
                    `;
        });
        document.getElementById("tbl-facturas").innerHTML = this.template;
        this.template = "";
      })
      .catch((err) => console.log(err));
  }

  getFactura() {
    fetch("/reportes/getFactura", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        id: this.idfactura,
      }),
    })
      .then((info) => info.json())
      .then((info) => {
        this.template = `<tr id="${info[0].id}">
                                <td>${info[0].id}</td>
                                <td>${moment(info[0].fecha).format(
                                  "ddd, DD-MMM-yyyy"
                                )}</td>
                                <td>${info[0].nombre_comprador}</td>
                                <td>${parseFloat(info[0].totalFactura).toFixed(
                                  2
                                )}</td>
				                        <td>
                                  <button 
                                    class="fa fa-edit btn btn-info btn-sm"
                                    btn="btnDetallesFactura"
                                    data-target="#modalDetalles"
                                    data-toggle="modal"
                                    ></button>
				                        </td>
                            </tr>
            `;
        document.getElementById("tbl-facturas").innerHTML = this.template;
        this.template = "";
      })
      .catch((error) => console.log(error));
  }

  getDetallesFactura() {
    fetch("/reportes/getDetallesFactura", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        factura: this.idfactura,
      }),
    })
      .then((detalles) => detalles.json())
      .then((detalles) => {
        detalles.map((detalle) => {
          this.template += `
						<tr 
            id="${detalle.id}" 
            idProducto="${detalle.producto}" 
            precioProducto="${detalle.precioProducto}" 
            factura="${detalle.factura}">
							<td>${detalle.cantidadProducto}</td>
							<td>${detalle.nombre}</td>
							<td>${detalle.precioProducto}</td>
							<td>${detalle.totalVenta}</td>
							<td>
								<button class="btn btn-success btn-sm" btn="btnDevolverDetalle">Devolver</button>
							</td>
						</tr>
					`;
        });
        document.getElementById("table-detalles").innerHTML = this.template;
        this.template = "";
      })
      .catch((error) => console.log(error));
  }

  devolver(detalle, cantidad, producto, precioProducto, factura) {
    fetch("/reportes/devoluciones", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        detalle: detalle,
        cantidad: cantidad,
        producto: producto,
        precio: precioProducto,
        factura: factura,
      }),
    })
      .then((message) => message.text())
      .then(async(message) => {
        await swal.fire({
          title : 'Exito.',
          text :message, 
          icon : 'success',
          timer :2000
        })
        this.getDetallesFactura();
        this.getFacturas();
      })
      .catch((error) => console.log(error));
  }

}

var reportes = new Reportes();

reportes.form.addEventListener("submit", (e) => {
  e.preventDefault();
  reportes.getDatos();
  reportes.getFacturas();
});

document
  .getElementById("form-buscar-factura")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    let factura = new FormData(document.getElementById("form-buscar-factura"));
    reportes.idfactura = factura.get("factura");
    reportes.getFactura();
  });

document.getElementById("tbl-facturas").addEventListener("click", (e) => {
  let btn = e.target.getAttribute("btn");
  if (btn == "btnDetallesFactura") {
    reportes.idfactura =
      e.target.parentElement.parentElement.getAttribute("id");
    reportes.getDetallesFactura();
  }
});

document.getElementById("table-detalles").addEventListener("click", async(e) => {
  let btn = e.target.getAttribute("btn");
  let detalle, producto, precio, factura;
  if (btn == "btnDevolverDetalle") {
    //reportes.getDetallesFactura();
    //let cantidad = prompt("Cantidad a devolver:", 0);
    let { value: devolver } = await swal.fire({
      title: 'Devoluciones',
      input: 'number',
      inputLabel: 'Cant.',
      inputPlaceholder: 'Ingrese cantidad a devolver'
    })

    if (devolver) {
      if(devolver != ''){
        detalle = e.target.parentElement.parentElement.getAttribute("id");
        producto =
          e.target.parentElement.parentElement.getAttribute("idProducto");
        precio =
          e.target.parentElement.parentElement.getAttribute("precioProducto");
        factura = e.target.parentElement.parentElement.getAttribute("factura");
        reportes.devolver(detalle, devolver, producto, precio, factura);
      }
    }
  }
});

