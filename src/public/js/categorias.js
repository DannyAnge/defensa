
class Categoria {
  constructor() {
    this.id;
    this.nombre;
    this.descripcion;
    this.formulario = document.getElementById("formulario-categoria");
    this.bandera = true;
    this.btnActualizar = document.getElementById("btnActualizarCategoria");
    this.btnGuardar = document.getElementById("btnGuardarCategoria");
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  /* LISTO */
  validar() {
    let data = new FormData(this.formulario);
    this.nombre = data.get("nombre");
    this.descripcion = data.get("descripcion");
    if (this.nombre === "") {
      return false;
      alert("Complete el campo nombre..");
    } else {
      return true;
    }
  }

  /* LISTO */
  limpiar() {
    this.formulario.reset();
  }

  /* LISTO */
  guardar() {
    if (this.validar()) {
      fetch("/categorias/guardar", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          nombre: this.nombre,
          descripcion: this.descripcion,
        }),
      })
        .then((res) => res.text())
        .then((res) => {
          alert(res);
          this.limpiar();
          this.mostrar("");
          producto.getCategorias();
        })
        .catch((error) => console.log(error));
    }
  }

  editar() {
    fetch("/categorias/editar", {
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
        this.bandera = false;
        this.btnActualizar.disabled = false;
        this.btnGuardar.disabled = true;
        document.getElementById("nombreCategoria").value = info[0].nombre;
        document.getElementById("descripcionCategoria").value =
          info[0].descripcion;
        this.id = info[0].id;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  actualizar() {
    if (this.validar()) {
      fetch("/categorias/actualizar", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          id: this.id,
          nombre: this.nombre,
          descripcion: this.descripcion,
        }),
      })
        .then((res) => res.text())
        .then((res) => {
          alert(res);
          this.bandera = true;
          this.limpiar();
          this.mostrar("");
          this.btnActualizar.disabled = true;
          this.btnGuardar.disabled = false;
        })
        .catch((error) => console.log(error));
    }
  }

  eliminar() {
    fetch("/categorias/eliminar", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        id: this.id,
      }),
    })
      .then((message) => message.text())
      .then((message) => {
        alert(message);
        this.mostrar("");
      });
  }

  /* LISTO */
  mostrar(cat) {
    let table = document.getElementById("table-categorias");
    let template = "";
    fetch("/categorias/getCategorias", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        categoria: cat,
      }),
    })
      .then((categorias) => categorias.json())
      .then((categorias) => {
        categorias.map((categoria) => {
          template += `
                        <tr id='${categoria.id}'>
                            <td>${categoria.id}</td>
                            <td>${categoria.nombre}</td>
                            <td>${categoria.descripcion}</td>
                            <td>
                                <button class="btn btn-info btn-sm icon-pencil-neg" btn="btnEditarCategoria"></button>
                                <button class="btn btn-danger btn-sm icon-trash" btn="btnEliminarCategoria"></button>
                            </td>
                        </tr>
                    `;
        });
        table.innerHTML = template;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

const categoria = new Categoria();
categoria.mostrar("");

document
  .getElementById("formulario-categoria")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    if (categoria.bandera) {
      categoria.guardar();
    } else {
      categoria.actualizar();
    }
  });

document.getElementById("table-categorias").addEventListener("click", (e) => {
  let btn = e.target.getAttribute("btn");
  if (btn == "btnEditarCategoria") {
    categoria.setId(e.target.parentElement.parentElement.getAttribute("id"));
    categoria.editar();
  } else if (btn == "btnEliminarCategoria") {
    let confirmar = confirm("Seguro que quieres eliminar esta categoria.");
    if (confirmar) {
      categoria.setId(e.target.parentElement.parentElement.getAttribute("id"));
      categoria.eliminar();
    }
  }
});

document.getElementById("txtBuscarCategoria").addEventListener("keyup", () => {
  categoria.mostrar(document.getElementById("txtBuscarCategoria").value);
});

