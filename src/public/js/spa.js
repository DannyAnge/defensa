window.addEventListener('hashchange', () => {
    router(window.location.hash)
});

//CONTENEDORES
const contFacturacion = document.getElementById('view-facturacion');
const contViewReportes = document.getElementById('view-reportes');
const contInventario = document.getElementById('view-inventario');
const contUsuarios = document.getElementById('view-usuarios');
const contTransacciones = document.getElementById('view-transacciones');
const contPerfil = document.getElementById('view-perfil');

const listContenedores = [contFacturacion, contViewReportes, contInventario, contUsuarios, contTransacciones, contPerfil];
var validar;

//OPCIONES
const opcionFacturacion = document.getElementById('opcion-facturacion');
const opcionViewReportes = document.getElementById('opcion-reportes');
const opcionInventario = document.getElementById('opcion-inventario');
const opcionUsuarios = document.getElementById('opcion-usuarios');
const opcionTransacciones = document.getElementById('opcion-transacciones');
const opcionPerfil = document.getElementById('opcion-perfil');
const listOpciones = [
    opcionFacturacion,
    opcionViewReportes,
    opcionInventario,
    opcionUsuarios,
    opcionTransacciones,
    opcionPerfil
];


//OCULTAR LOS CONTENEDORES
const v = () => {
    listContenedores.map(
        opcion => {
            validar = opcion.classList.contains('show');
            if (validar) {
                opcion.classList.replace('show', 'hide');
            }
        }
    )
}

const styleOpciones = () => {
    listOpciones.map(
        opcion => {
            validar = opcion.classList.contains('option-active');
            if (validar) {
                opcion.classList.remove('option-active');
            }
        }
    )
}

//MOSTRAR EL CONTENEDOR CORRESPONDIENTE A LA OPCION SELECCIONADA
const router = (rutas) => {
    switch (rutas) {
        case '#/': {
            v();
            contFacturacion.classList.replace('hide', 'show');
        } break;
        case '#/Reportes': {
            v();
            contViewReportes.classList.replace('hide', 'show');
        } break;
        case '#/inventario': {
            v();
            contInventario.classList.replace('hide', 'show');
        } break;
        case '#/usuarios': {
            v();
            contUsuarios.classList.replace('hide', 'show');
        } break;
        case '#/transacciones': {
            v();
            contTransacciones.classList.replace('hide', 'show');
        } break;
        case '#/perfil': {
            v();
            contPerfil.classList.replace('hide', 'show');
        } break;
        default: break;
    }
}

document.querySelector('.navbar-nav').addEventListener('click', (click) => {
    let opcion = click.target.parentElement.parentElement.getAttribute('id');
    switch (opcion) {
        case 'opcion-facturacion': {
            styleOpciones();
            opcionFacturacion.classList.add('option-active')
        }
            break;
        case 'opcion-reportes': {
            styleOpciones();
            opcionViewReportes.classList.add('option-active')
        } break;
        case 'opcion-inventario': {
            styleOpciones();
            opcionInventario.classList.add('option-active')
        } break;
        case 'opcion-usuarios': {
            styleOpciones();
            opcionUsuarios.classList.add('option-active')
        } break;
        default:
            break;
        case 'opcion-transacciones': {
            styleOpciones();
            opcionTransacciones.classList.add('option-active')
        } break;
        case 'opcion-perfil': {
            styleOpciones();
            opcionPerfil.classList.add('option-active')
        } break;
    }
})
