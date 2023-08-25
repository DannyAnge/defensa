class Usuarios {
  #id;
  #nombre;
  #password;
  #permiso;
  constructor() {
    this.formulario = document.forms["form-usuarios"];
    this.btnUsuarios = document.getElementById("btn-usuarios");
    this.getUsers("");
    this.formData;
    this.newUser;
    this.bandera = true;
  }

  setId(id) {
    this.#id = id;
  }
  getId() {
    return this.#id;
  }

  peticion(url) {
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(this.newUser),
    })
      .then((res) => res.json())
      .then((res) => {
        Swal.fire({
          title: "Exito.",
          text: res.message,
          icon: "success",
          timer: 2000,
        });
        this.formulario.reset();
        this.getUsers("");
      })
      .catch((error) => console.log(erro));
  }

  guardar() {
    this.formData = new FormData(this.formulario);
    this.newUser = {
      nombreUsuario: this.formData.get("userName"),
      password: this.formData.get("password"),
      permiso: this.formData.get("permiso"),
    };

    this.peticion("/usuarios/guardar");
  }

  actualizar() {
    this.formData = new FormData(this.formulario);
    this.newUser = {
      id: this.formData.get("id"),
      nombreUsuario: this.formData.get("userName"),
      password: this.formData.get("password"),
      permiso: this.formData.get("permiso"),
    };

    this.peticion("/usuarios/actualizar");
    this.bandera = true;
    this.btnUsuarios.innerHTML = "Crear";
  }

  editar() {
    fetch("/usuarios/editar/" + this.#id)
      .then((info) => info.json())
      .then((info) => {
        this.formulario["id"].value = info.id;
        this.formulario["userName"].value = info.nombreUsuario;
        this.formulario["password"].value = info.password;
        this.formulario["permiso"].value = info.permiso;
        this.bandera = false;
        this.btnUsuarios.innerHTML = "Actualizar";
      })
      .catch((error) => console.log(error));
  }

  eliminar(){
      fetch('/usuarios/eliminar/'+this.#id,{method:'DELETE'})
      .then(res=>res.json())
      .then(res=>{
          Swal.fire({
              title:res.title,
              text: res.message,
              icon:res.icon,
              timer:2000
          })
          this.getUsers('')
      })
      .catch(error=>console.log(error))
  }

  getUsers(value) {
    let table = document.getElementById("table-usuarios");
    let template = "";

    fetch("/usuarios/getUsers", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ valor: value }),
    })
      .then((users) => users.json())
      .then((users) => {
        users.map((user) => {
          template += `
                    <tr id="${user.id}">
                        <td>
                            <button class="btn btn-success btn-sm icon-pencil-neg" btn='btn-editar-usuario'></button>
                            <button class="btn btn-danger btn-sm icon-trash" btn='btn-eliminar-usuario'></button>
                        </td>
                        <td>${user.nombreUsuario}</td>
                        <td>${user.permiso}</td>
                    </tr>
                `;
        });
        table.innerHTML = template;
      })
      .catch((error) => console.log(error));
  }
}

//IMPLEMENTACION
const user = new Usuarios();

user.formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  if (user.bandera) {
    user.guardar();
  } else {
    user.actualizar();
  }
});

document.getElementById("table-usuarios").addEventListener("click", (event) => {
  let btn = event.target.getAttribute("btn");
  if (btn == "btn-editar-usuario") {
    user.setId(event.target.parentElement.parentElement.getAttribute("id"));
    user.editar();
  }else if(btn=='btn-eliminar-usuario'){
    user.setId(event.target.parentElement.parentElement.getAttribute("id"));
    user.eliminar();
  }
});
