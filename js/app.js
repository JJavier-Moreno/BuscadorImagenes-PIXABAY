const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {

    formulario.addEventListener('submit', validarFormulario);

}

function validarFormulario(e) {
    e.preventDefault();
    const termino = document.querySelector('#termino').value;

    if (termino === '') {
        alerta('Agrega un término de búsqueda');
        return;
    }

    buscarImagenes();
}

function alerta(msg) {

    const existeAlerta = document.querySelector('.bg-red-100');
    if (!existeAlerta) {
        const error = document.createElement('p');
        error.textContent = msg;
        error.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'rounded', 'mt-6', 'px-4', 'py-3', 'text-center', 'max-w-lg', 'mx-auto');

        error.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${msg}</span>
        `
        formulario.appendChild(error);

        setTimeout(() => {
            error.remove();
        }, 3000)
    }

}

async function buscarImagenes() {

    const termino = document.querySelector('#termino').value;


    const key = '40220201-04e6255ec872a9a9ca67a3368';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();

        totalPaginas = (calcularPaginas(resultado.totalHits));
        mostrarImagenes(resultado.hits);


    } catch (error) {
        console.log(error);
    }
}

function calcularPaginas(total){
    return parseInt(Math.ceil(total/registrosPorPagina));
}

function mostrarImagenes(imagenes) {

    limpiarHTML();

    imagenes.map((imagen) => {

        const { previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-4 mb-4">
        <div class="bg-white">
        <img src="${previewURL}" class="w-full" />

        <div class="p-4">
        <p class="font-bold">${likes}<span class="font-light"> Likes</span></p>
        <p class="font-bold">${views}<span class="font-light"> Veces vista</span></p>

        <a class="block w-full bg-blue-800 hover:bg-blue-500 uppercase text-white text-center font-bold rounded mt-5 p-1" 
        href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
        Ver Imagen
        </a>
        </div>
        </div>
        </div>
        `
    })

    //limpiar el anterior paginador
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

     imprimirGenerador();

}

//Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total){
    for(let i = 1; i<=total ; i++){
        yield i;
    }
}

function imprimirGenerador(){
         iterador = crearPaginador(totalPaginas);

         while(true){
            const {value, done } = iterador.next();

            if(done) return;

            //Caso contrario, genera un boton por cada elemento del generador.
            const boton = document.createElement('a');
            boton.href = "#";
            boton.dataset.pagina = value;
            boton.textContent = value;
            boton.classList.add('siguiente','bg-yellow-400','px-4','py-1','mr-2','font-bold','mb-10','uppercase','rounded');

            boton.onclick = () => {
                paginaActual = value;
                buscarImagenes();
            }
            paginacionDiv.appendChild(boton);
         }

}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}