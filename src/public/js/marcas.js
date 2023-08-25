class Marca {
    constructor() {
        this.id;
        this.nombre;
        this.descripcion;
        this.template = '';
        this.bandera = true;
        this.formData;
        this.form = document.getElementById('formulario-marcas');
        this.btnGuardar = document.getElementById('btnGuardarMarca');
        this.btnActualizar = document.getElementById('btnActualizarMarca');
        this.mostrar('');
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    validar() {
        this.formData = new FormData(this.form);
        this.nombre = this.formData.get('nombre');
        this.descripcion = this.formData.get('descripcion');
        if (this.nombre == '') {
            return false;
        } else {
            return true;
        }
    }

    guardar() {
        if (this.validar()) {
            fetch('/marcas/guardar', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    nombre: this.nombre,
                    descripcion: this.descripcion
                })
            })
                .then(message => message.text())
                .then(message => {
                    alert(message)
                    this.mostrar('')
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    editar() {
        fetch('/marcas/editar', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ id: this.id })
        })
            .then(marca => marca.json())
            .then(marca => {
                marca.map(
                    info => {
                        document.getElementById("nombreMarca").value = info.nombre;
                        document.getElementById("descripcionMarca").value = info.descripcion;
                        this.bandera = false;
                        this.btnActualizar.disabled = false;
                        this.btnGuardar.disabled = true;
                    }
                )
            })
            .catch(error => console.log(error))
    }

    actualizar() {
        if (this.validar()) {
            fetch('/marcas/actualizar', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify({
                    id: this.id,
                    nombre: this.nombre,
                    descripcion: this.descripcion
                })
            })
                .then(message => message.text())
                .then(message => {
                    alert(message)
                    this.bandera = true;
                    this.mostrar('')
                    this.btnActualizar.disabled = true;
                    this.btnGuardar.disabled = false;
                })
                .catch();
        }
    }

    eliminar() {
        fetch('/marcas/eliminar', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
            body: JSON.stringify({
                id: this.id,
            })
        })
            .then(message => message.text())
            .then(message => {
                alert(message)
                this.mostrar('')
            })
            .catch(error=>console.log(error));
    }

    mostrar(valor) {
        fetch('/marcas/getMarcas', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                valor
            })
        })
            .then(marcas => marcas.json())
            .then(marcas => {
                marcas.map(
                    marca => {
                        this.template += `
                        <tr id="${marca.id}">
                            <td>${marca.id}</td>
                            <td>${marca.nombre}</td>
                            <td>${marca.descripcion}</td>
                             <td>
                                <button class="btn btn-info btn-sm icon-pencil-neg" btn="btnEditarMarca"></button>
                                <button class="btn btn-danger btn-sm icon-trash" btn="btnEliminarMarca"></button>
                            </td>
                        </tr>
                    `;
                    }
                )
                document.getElementById('table-marcas').innerHTML = this.template;
                this.template = '';
            })
            .catch(error => console.log(error))
    }
}

/* ---------------------------------------- IMPLEMENTACION ------------------------------------*/

var marca = new Marca();

/* Guardar */
document.getElementById('formulario-marcas').addEventListener('submit', (e) => {
    e.preventDefault();
    if (marca.bandera) {
        marca.guardar();
    } else {
        marca.actualizar();
    }
})

/* buscar marca */
document.getElementById("txtBuscarMarca").addEventListener('keyup', () => {
    marca.mostrar(document.getElementById("txtBuscarMarca").value);
})

document.getElementById("table-marcas").addEventListener('click', (e) => {
    let btn = e.target.getAttribute("btn");
    if (btn == "btnEditarMarca") {
        marca.setId(e.target.parentElement.parentElement.getAttribute("id"));
        marca.editar();
    } else if (btn == 'btnEliminarMarca') {
        marca.setId(e.target.parentElement.parentElement.getAttribute("id"));
        marca.eliminar();
    }
})


