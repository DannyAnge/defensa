class Productos {
  constructor() {
    this.id;
    this.codigoBarra;
    this.nombre;
    this.precioCompra;
    this.precioVenta;
    this.stock;
    this.categoria;
    this.marca;
    this.descripcion;
    this.utilidad;
    this.template = "";
    this.form = document.getElementById("form-productos");
    this.btnGuardar = document.getElementById("guardarProducto")
    this.btnActualizar = document.getElementById("actualizarProducto")
    this.btnActualizar.disabled = true;
    this.getCategorias();
    this.getMarcas();
    this.mostrar("");
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  validacionCodBarra(codigoBarra) {
    fetch("/productos/codBarra", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        codigoBarra: codigoBarra,
      }),
    })
      .then((isExiste) => isExiste.json())
      .then((isExiste) => {
        if (isExiste.isExiste) {
          document
            .getElementById("validacion-codBarra")
            .classList.remove("hide");
        } else {
          document
            .getElementById("validacion-codBarra")
            .classList.add("hide");
        }
      })
      .catch();
  }

  validar() {
    let datos = new FormData(this.form);
    this.codigoBarra = datos.get("codBarra");
    this.nombre = datos.get("nombre");
    this.precioCompra = datos.get("precioCompra");
    this.precioVenta = datos.get("precioVenta");
    this.stock = datos.get("cantidad");
    this.categoria = datos.get("categoria");
    this.marca = datos.get("marca");
    this.descripcion = datos.get("descripcion");

    if (this.nombre === "") {
      return false;
    } else if (this.stock === "") {
      return false;
    } else if (this.precioVenta === "") {
      return false;
    } else {
      return true;
    }
  }

  guardar() {
    if (this.validar()) {
      fetch("productos/guardar", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          codigoBarra: this.codigoBarra,
          nombre: this.nombre,
          precioCompra: this.precioCompra,
          precioVenta: this.precioVenta,
          stock: this.stock,
          categoria: this.categoria,
          marca: this.marca,
          descripcion: this.descripcion,
        }),
      })
        .then((message) => message.text())
        .then((message) => {
          swal.fire({
            title:'Exito.',
            text : message,
            icon: 'success',
            timer : 2000
          })
          this.form.reset();
          this.mostrar();
        })
        .catch((err) => console.log(err));
    }
  }

  mostrar(valor) {
    let template = "";
    fetch("/productos/getProductos", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        valor: valor,
      }),
    })
      .then((productos) => productos.json())
      .then((productos) => {
        productos.map((producto) => {
          template += `
                      <tr id='${producto.id}'>
                          <td>
                              <button class="icon-trash btn btn-danger btn-sm" btn="eliminarProducto"></button>
                              <button class="fa fa-edit btn btn-info btn-sm" btn="editarProducto"></button>
                          </td>
                          <td>${producto.codigoBarra}</td>
                          <td>${producto.nombre}</td>
                          <td>${producto.precioCompra}</td>
                          <td>${producto.precioVenta}</td>
                          <td class="${(producto.stock==0) ? 'text-danger' : ''}">${producto.stock}</td>
                          <td>${producto.descripcion}</td>
                          <td>${producto.categoria}</td>
                          <td>${producto.marca}</td>
                      </tr>
                  `;
        });
        document.getElementById("table-productos").innerHTML = template;
      })
      .catch((err) => console.log(err));
  }

  editar() {
    fetch("/productos/editar", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ producto: this.id }),
    })
      .then((producto) => producto.json())
      .then((producto) => {
        document.getElementById("CodigoBarraProducto").value =
          producto[0].codigoBarra;
        document.getElementById("nombreProducto").value = producto[0].nombre;
        document.getElementById("precioCompraProducto").value =
          producto[0].precioCompra;
        document.getElementById("precioVentaProducto").value =
          producto[0].precioVenta;
        document.getElementById("stockProducto").value = producto[0].stock;
        document.getElementById("cmbMarcaProducto").value = producto[0].marca;
        document.getElementById("cmbCategoriasProducto").value =
          producto[0].categoria;
        document.getElementById("descripcionProducto").value =
          producto[0].descripcion;
        this.btnActualizar.disabled = false;
        this.btnGuardar.disabled = true;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  eliminar() {
    fetch("/productos/eliminar", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ producto: this.id }),
    })
      .then((message) => message.text())
      .then((message) => {
        alert(message);
        this.mostrar("");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  actualizar() {
    if (this.validar()) {
      fetch("/productos/actualizar", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          codigoBarra: this.codigoBarra,
          nombre: this.nombre,
          precioCompra: this.precioCompra,
          precioVenta: this.precioVenta,
          stock: this.stock,
          categoria: this.categoria,
          marca: this.marca,
          descripcion: this.descripcion,
          id: this.id,
        }),
      })
        .then((message) => message.text())
        .then((message) => {
          swal.fire({
            title:'Exito.',
            text : message,
            icon: 'success',
            timer : 2000
          })
          document.getElementById("guardarProducto").disabled = false;
          document.getElementById("actualizarProducto").disabled = true;
          this.form.reset();
          this.mostrar("");
          this.btnActualizar.disabled = true;
          this.btnGuardar.disabled = false;
        })
        .catch((err) => console.log(err));
    }
  }

  getCategorias() {
    fetch("/productos/getCategorias")
      .then((categorias) => categorias.json())
      .then((categorias) => {
        categorias.map((categoria) => {
          this.template += `
                              <option value="${categoria.id}">${categoria.nombre}</option>
          `;
        });
        document.getElementById(
          "cmbCategoriasProducto"
        ).innerHTML = this.template;
        this.template = "";
      })
      .catch((error) => console.log(erro));
  }

  getMarcas() {
    fetch("/productos/getMarcas")
      .then((marcas) => marcas.json())
      .then((marcas) => {
        marcas.map((marca) => {
          this.template += `
                              <option value="${marca.id}">${marca.nombre}</option>
          `;
        });
        document.getElementById("cmbMarcaProducto").innerHTML = this.template;
        this.template = "";
      })
      .catch((error) => console.log(error));
  }

  getProductosMinStock(){
    fetch('/productos/minStock')
    .then(productos=>productos.json())
    .then(productos=>{
        productos.map(producto=>{
          this.template += `
              <tr>
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.stock}</td>
              </tr>
          `;
        }) 
        document.getElementById('table-productos-min-stock').innerHTML = this.template;
    })
    .catch(error=>console.log(error))
    .finally(this.template = "");

  }
}

var producto = new Productos();

document.getElementById("table-productos").addEventListener("click", (e) => {
  let idProducto;
  let btn = e.target.getAttribute("btn");
  if (btn === "editarProducto") {
    idProducto = e.target.parentElement.parentElement.getAttribute("id");
    producto.setId(idProducto);
    producto.editar();
    document.getElementById("guardarProducto").disabled = true;
    document.getElementById("actualizarProducto").disabled = false;
  } else if (btn === "eliminarProducto") {
    idProducto = e.target.parentElement.parentElement.getAttribute("id");
    let confirmar = confirm("esta seguro que quiere eliminar este producto");
    if (confirmar) {
      producto.setId(idProducto);
      producto.eliminar();
    } else {
    }
  }
});

document.getElementById("guardarProducto").addEventListener("click", () => {
  producto.guardar();
});

document.getElementById("actualizarProducto").addEventListener("click", (e) => {
  producto.actualizar();
});

document.getElementById("txtBuscarProducto").addEventListener("keyup", () => {
  producto.mostrar(document.getElementById("txtBuscarProducto").value);
});

document.getElementById("CodigoBarraProducto").addEventListener("keyup", () => {
  producto.validacionCodBarra(
    document.getElementById("CodigoBarraProducto").value
  );
});

document.getElementById('btn-min-stock').addEventListener('click',()=>{
  producto.getProductosMinStock();
})

