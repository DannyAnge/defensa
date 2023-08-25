class Transacciones {
  constructor() {
    this.id;
    this.fecha;
    this.monto;
    this.tipoTransaccion;
    this.anotaciones;
    this.form = document.getElementById("form-transacciones");
    this.data;
    this.bandera = true;
    this.template = "";
    moment.locale("es");
    document.getElementById("btnActualizarTransaccion").disabled = true;
    this.fechaNow = moment().format("yyyy-MM-DD");
    document.getElementById("fechaTransaccion").value = this.fechaNow;
    this.mostrar("");
  }

  setId(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  validar() {
    this.data = new FormData(this.form);
    this.fecha = this.data.get("fecha");
    this.tipoTransaccion = this.data.get("tipoTransaccion");
    this.monto = this.data.get("monto");
    this.anotaciones = this.data.get("nota");

    if (this.monto == "") {
      alert("El campo monto no puede ir vacio.");
      return false;
    } else return true;
  }

  guardar() {
    if (this.validar()) {
      console.log(this.fecha);
      fetch("/transacciones/guardar", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          fecha: this.fecha,
          tipoTransaccion: this.tipoTransaccion,
          monto: this.monto,
          descripcion: this.anotaciones,
        }),
      })
        .then((message) => message.text())
        .then((message) => {
          alert(message);
          this.mostrar("");
          this.limpiar();
        })
        .catch((error) => console.log(error));
    }
  }

  editar() {
    fetch("/transacciones/editar", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        id: this.id,
      }),
    })
      .then((info) => info.json())
      .then((info) => {
        info.map((infor) => {
          document.getElementById("fechaTransaccion").value = moment(
            infor.fecha
          ).format("yyyy-MM-DD");
          document.getElementById("cmbTransaccion").value =
            infor.tipoTransaccion;
          document.getElementById("jsMontoTransaccion").value = infor.monto;
          document.getElementById("txtAreaAnotacionesTransaccion").value =
            infor.descripcion;
          this.bandera = false;
          document.getElementById("btnActualizarTransaccion").disabled = false;
          document.getElementById("btnGuardarTransaccion").disabled = true;
        });
      })
      .catch((error) => console.log(error));
  }

  actualizar() {
    if (this.validar()) {
      fetch("/transacciones/actualizar", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          fecha: this.fecha,
          tipoTransaccion: this.tipoTransaccion,
          monto: this.monto,
          anotaciones: this.anotaciones,
          id: this.id,
        }),
      })
        .then((message) => message.text())
        .then((message) => {
          alert(message);
          document.getElementById("btnActualizarTransaccion").disabled = true;
          document.getElementById("btnGuardarTransaccion").disabled = false;
          this.mostrar("");
          this.limpiar();
          this.bandera = true;
        })
        .catch((error) => console.log(error));
    }
  }

  eliminar() {
    fetch("/transacciones/eliminar", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({
        id: this.id,
      }),
    })
      .then((message) => message.text())
      .then((message) => {
        alert(message);
        this.mostrar("");
      })
      .catch((error) => console.log(error));
  }

  mostrar(value) {
    fetch("/transacciones/mostrar", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        value: value,
      }),
    })
      .then((transacciones) => transacciones.json())
      .then((transacciones) => {
        transacciones.map((transaccion) => {
          this.template += `
              <tr id="${transaccion.id}">
                <td>
                  <button class="btn btn-info btn-sm icon-pencil-neg" btn="btnEditarTransaccion"></button>
                  <button class="btn btn-danger btn-sm icon-trash" btn="btnEliminarTransaccion"></button>
                </td>
                <td>${moment(transaccion.fecha).format("ddd, DD-MMM-yyyy")}</td>
                <td>${transaccion.tipoTransaccion}</td>
                <td>${transaccion.monto}</td>
                <td>${transaccion.descripcion}</td>
              </tr>
            `;
        });
        document.getElementById("table-transacciones").innerHTML =
          this.template;
        this.template = "";
      })
      .catch((error) => console.log(error));
  }

  limpiar() {
    this.form.reset();
  }
}

var transaccion = new Transacciones();

document
  .getElementById("form-transacciones")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    if (transaccion.bandera) {
      transaccion.guardar();
    } else {
      transaccion.actualizar();
    }
  });

document
  .getElementById("table-transacciones")
  .addEventListener("click", (e) => {
    let btn = e.target.getAttribute("btn");
    if (btn == "btnEliminarTransaccion") {
      if (confirm("SEGURO QUIERES ELIMINAR ESTA TRANSACCION.?")) {
        transaccion.setId(
          e.target.parentElement.parentElement.getAttribute("id")
        );
        transaccion.eliminar();
      }
    } else if (btn == "btnEditarTransaccion") {
      transaccion.setId(
        e.target.parentElement.parentElement.getAttribute("id")
      );
      transaccion.editar();
    }
  });
