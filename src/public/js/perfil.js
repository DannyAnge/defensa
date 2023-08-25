class Perfil {
    constructor() {
        this.nombre;
        this.direccion;
        this.mensaje;
        this.telefono;
        this.formPerfil = document.getElementById("form-perfil");
        this.txtNombre = document.getElementById("nombrePerfil");
        this.txtDireccion = document.getElementById("direccionPerfil");
        this.txtMensaje = document.getElementById("mensajePerfil");
        this.txtTelefono = document.getElementById("telefonoPerfil");
        this.mostrar();
    }

    validar() {
        let perfil = new FormData(this.formPerfil);
        this.nombre = perfil.get("nombre")
        this.direccion = perfil.get("direccion")
        this.mensaje = perfil.get("mensaje")
        this.telefono = perfil.get('telefono')
        if (this.nombre == "") {
            return false;
        } else if (this.direccion == "") {
            return false;
        } else if (this.mensaje == "") {
            return false;
        } else {
            return true;
        }
    }

    guardar() {
        if (this.validar()) {
            fetch('/perfil/guardar', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    nombre: this.nombre,
                    direccion: this.direccion,
                    mensaje: this.mensaje,
                    telefono: this.telefono
                })
            })
                .then(message => message.text())
                .then(message => {
                    alert(message)
                    this.mostrar();
                    this.formPerfil.reset();
                })
                .catch(error => console.log(error))
        }
    }

    mostrar() {
        fetch('/perfil/mostrar')
            .then(perfil => perfil.json())
            .then(perfil => {
                perfil.map(
                    p => {
                        this.txtNombre.innerText = p.nombre;
                        this.txtDireccion.innerText = p.direccion;
                        this.txtMensaje.innerText = p.mensaje;
                        this.txtTelefono.innerText = p.telefono;
                    }
                )
            })
            .catch(error => console.log(error))
    }

    editar() {
        fetch('/perfil/mostrar')
            .then(perfil => perfil.json())
            .then(perfil => {
                perfil.map(
                    p => {
                        document.getElementById('txtNombrePerfil').value = p.nombre;
                        document.getElementById('txtDireccionPerfil').value = p.direccion;
                        document.getElementById('txtMensajePerfil').value = p.mensaje;
                        document.getElementById('txtTelefonoPerfil').value = p.telefono;
                    }
                )
            })
            .catch(error => console.log(error))
    }
}

const perfil = new Perfil();

perfil.formPerfil.addEventListener('submit', (e) => {
    e.preventDefault();
    perfil.guardar();
})

document.getElementById('btnEditarPerfil').addEventListener('click', () => {
    perfil.editar();
})