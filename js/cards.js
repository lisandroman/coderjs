const tours = document.querySelector('#ListaDeTours');  
const total = document.querySelector('#total');
const contenidoDelCarrito = document.querySelector('#carritoContenido tbody');
const botonVaciar = document.querySelector('#vaciarCarrito');
let toursInfo = [];
let cantidadEnCarrito = ""

//Creo los Listeners
loadEventListeners();
function loadEventListeners () {
    //DOM Cargado
    document.addEventListener('DOMContentLoaded', getFromLocalStorage);   
    //Comprar Tour
    tours.addEventListener('click', comprarTour);
    //Remover Tour
    contenidoDelCarrito.addEventListener('click', removerTour);
    //Limpiar Carrito
    botonVaciar.addEventListener('click', limpiarCarrito);
}
// Carga el JSON 
$(document).ready(()=> {
    $.getJSON("js/datos-orig.json", (response, status)=> {
        if (status === "success") {
            toursInfo = response
            dibujarGrilla(toursInfo);
        } else {
            $("#ListaDeTours").html(contenidoError);
        }                  
    });
    const busqueda = document.querySelector ('#busqueda');
    busqueda.addEventListener('keyup', buscar);
});  

//Muestro el modal del Carrito
$("#mostrarModalBtn").click(function() {
    $("#modalContainer").show();
    sumTotal();
});
    
//Cierro el modal del Carrito
$("#cerrarModalBtn").click(function () {
    $("#modalContainer").hide();
});

// Función para "dibujar" el contenido dinámico de las cards
const dibujarGrilla = (items) => {
    $("#contenido").show("slow", () => {
        for (const item of items) {
            $("#ListaDeTours").append(dibujarItem(item));
        }            
    });
    $("#ListaDeTours").fadeIn("slow");
}

const contenidoError = `<div class="center">
                            <h4 >No se pudo recuperar el contenido</h4>
                            <h5>Intente nuevamente en unos segundos...</h5>
                        </div>`

const dibujarItem = (item) => {
    const card = 
                `<div class="swiper-slide" > 
                    <div class="card">
                        <div class="card_head">
                            <img src="${item.img}" class="cardOverlay" onclick="ponerInformacionTour('${item.imgGrande}','${item.titulo}','${item.price}','${item.bajada}','${item.id}','${item.img}');"> 
                            <p class="textOverlay">${item.titulo}</p>
                        </div>
                        <div class="card_body">
                            <h5>${item.h4}</h5>
                            <p class="price">$<span>${item.price}</span></p>
                        </div>
                    </div>
                </div>`
    return card;
}

// Buscador de tours. Lo hace contra el título de cada Tour ofrecido
const buscar = () => {
    ListaDeTours.innerHTML = "";
     
    const texto = busqueda.value.toLowerCase();
    let encontro = false;                     // Uso un flag, por defecto false para chequear cambio de estado según el proceso. Este caso un for iterando todo el contenido
    for (let tour of toursInfo){
        let h4 = tour.h4.toLowerCase();
        if (h4.indexOf(texto) !== -1) {
            $("#ListaDeTours").append(dibujarItem(tour));
            encontro = true;
        };
    };
    if (!encontro){
        //console.log(ListaDeTours);
        ListaDeTours.innerHTML =` <li>Tour no encontrado...</li> `;
    };
};

//Función para comprar tours
function comprarTour(event) {
    event.preventDefault();
    
    if (event.target.classList.contains('agregarAlCarrito')) {
        const tour = event.target.parentElement.parentElement;
        infoDeTours(tour);
    }
}

function infoDeTours(tour) {
    // Objetos con info de los datos seleccionados
    const tourInfo = {
        image: tour.querySelector('img').src,
        title: tour.querySelector('h5').textContent,
        price: parseInt( tour.querySelector('.price span').textContent),
        id: tour.querySelector('a').getAttribute('data-id')
    }
    // Agregar en el carrito
    agregarDentroCarrito(tourInfo);
}

function agregarDentroCarrito(tour) {
    const row = document.createElement('tr');
    row.innerHTML = `
                    <tr>
                        <td>
                            <img src="${tour.image}" width=100>
                        </td>
                        <td>${tour.title}</td>
                        <td>$ ${tour.price}</td>
                        <td>
                            <a href="#" class="remove" data-id="${tour.id}">-</a>
                        </td>
                    </tr> `;
    contenidoDelCarrito.appendChild(row);
    //Agregar en local storage
    guardarDentroCarrito(tour);
    //Llama a la función de suma total del carrito
    sumTotal(tour);
}

function sumTotal (tour) {
    let sumar = getTourFromStorage();
    //Luego de obtener los datos del localstorage filtro los datos dejando solo Precios
    let sumarMap = sumar.map((sumar) => parseFloat(sumar.price));
    //Itero para sumar los valores del total
    let sumado=0;
    for(let i of sumarMap) sumado+=i;
    console.log("El total es de:$" +sumado);  
    
    //Creando la etiqueta en el carrito del Total, limpiando previamente si existe algun dato, para evitar sumas duplicadas
    var div = document.getElementById('total');
    while(div.firstChild){ 
        div.removeChild(div.firstChild); 
    }
    //Creando la etiqueta de suma
    const row = document.createElement('div');
    row.innerHTML = `<h5>Total: $${sumado}</h5> `;
    total.appendChild(row);
}

//Agregando los tours en localStorage
function guardarDentroCarrito(tour) {
    let toursInfo = getTourFromStorage();
    // console.log(tour);
    toursInfo.push(tour);
    localStorage.setItem('toursInfo', JSON.stringify(toursInfo) );
    actualizarCantidadToursEnCesta(toursInfo.length);
}

// Actualizo el numero indicador sobre el carrito
const actualizarCantidadToursEnCesta = (cantidad) => {
    const counter = document.getElementById('counter');
    const cl = counter.classList;
    const c = 'animated-counter';    
    counter.innerText = cantidad;
    cl.remove(c, cl.contains(c));
    setTimeout(() => counter.classList.add('animated-counter'),3)

    cantidadEnCarrito = cantidad;
    
}

function getTourFromStorage(){
    //debugger
    let toursInfo;
    // Si existe algo previo, obtenemos el valor o limpiamos el array
    if (localStorage.getItem('toursInfo') === null) {   //Revisar tours y el contenido
        toursInfo = [];
    } else {
        toursInfo = JSON.parse(localStorage.getItem('toursInfo'));
    }
    return toursInfo;
}
    
// Remover tour del DOM
function removerTour(e) {
    let tour, tourID;
    // Remover
    if(e.target.classList.contains('remove')) {
        e.target.parentElement.parentElement.remove();
        tour = e.target.parentElement.parentElement;
        tourID = tour.querySelector('a').getAttribute('data-id');
    }
    console.log(tourID);
    // Remover de localStorage - Item
    removerTourLocalStorage(tourID);
}

// Removiendo tour del localstorage
function removerTourLocalStorage(id) {
    // Acceso a los datos
    let toursLS = getTourFromStorage();

    var elimino=false;
    for(var index=0; index<toursLS.length;index++){
        if(toursLS && toursLS[index].id === id && !elimino) {
            toursLS.splice(index, 1);
            elimino=true;
        }
    }
    // Agregar el resto del array al localstorage
    localStorage.setItem('toursInfo', JSON.stringify(toursLS));
    // Llama la funcion suma del total de carrito
    sumTotal();
    actualizarCantidadToursEnCesta(toursLS.length);
}

//Funcion que vacía el carrito completamente
function limpiarCarrito (e) {
    while (contenidoDelCarrito.firstChild) {
        contenidoDelCarrito.removeChild (contenidoDelCarrito.firstChild);
    }
    while (total.firstChild) {
        total.removeChild (total.firstChild);
    }
    //Cuando presiono el botón "Vaciar Carrito"
    localStorage.clear() //Limpia localStorage
    actualizarCantidadToursEnCesta(0); // Actualiza el indicador de tours comprados
}
//Genera nuevamente el carrito luego de eliminar algun item de la lista
function getFromLocalStorage() {
    let toursLS = getTourFromStorage();

    toursLS.forEach(function(tour) {
        //Crear la tabla 
        const row = document.createElement('tr')
        row.innerHTML =`
                <tr>
                    <td>
                        <img src="${tour.image}" width=100>
                    </td>
                    <td>${tour.title}</td>
                    <td>${tour.price}</td>
                    <td>
                        <a href="#" class="remove" data-id="${tour.id}">-</a>
                    </td>
                </tr> `;
        contenidoDelCarrito.appendChild(row);
        actualizarCantidadToursEnCesta(toursLS.length);  // Actualizo cantidad de items en Carrito
    });
}

const comprarTourBackground = (image, title, price, id) => {
    const tourInfo = {image,title, price,id};
    // Agregar en el carrito
    agregarDentroCarrito(tourInfo);    
}

// Agrega el contenido dinámico del Fondo en .bg y también los titulos y precio
const ponerInformacionTour = (imgGrande, titulo, precio, bajada, id, imgChica) => {
    document.querySelector(".bg").style.backgroundImage = `url('${imgGrande}')`;
    const titularHtml = `
        <span>${titulo}</span>
        <h5>${bajada}</h5>
        <p>Precio: $${precio}</p>
        <button type="button" class="btn btn-danger" onclick="comprarTourBackground('${imgChica}','${titulo}','${precio}','${id}');">COMPRAR</button>`;
    document.getElementById("titles").innerHTML = titularHtml;
};

// Uso de Filter para el Menu Principal. Segun la elección, Filter devuelve los items correspondientes al Barrio elegido
function filtrarPorBarrio(barrio){
    ListaDeTours.innerHTML = "";                   
    let encontro = false;                         // Uso un flag, por defecto false para chequear cambio de estado según el proceso
    const resultado = toursInfo.filter(tour => tour.barrio === barrio);         
                                                                                
    for (let tour of resultado){
        $("#ListaDeTours").append(dibujarItem(tour));                        
        encontro = true;                        
    }
    if (!encontro){
        ListaDeTours.innerHTML =` <li>Tour no encontrado...</li> `;
    };
}


// Uso SweetAlert2 para el OK en la compra
const comprarCarrito = (evento) => {
    if (cantidadEnCarrito != 0) {
        Swal.fire({
            title: 'Gracias por tu compra!',
            text: "El costo es a cargo de Coderhouse",
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar'
        }).then((result) => {                       
            if (result.isConfirmed) {       // Espero la confirmación para luego limpiar el carrito
                Swal.fire(
                'Comprado!',
                'Esperamos volver a verte pronto',
                'success'
                )
                limpiarCarrito();  // Llamo a funcion para limpiar el contenido del carrito
            };
        });
    } else {
        Swal.fire({
            title: 'ERROR!',
            text: "El carrito está vacío",
            icon: 'error',
        })
    }
};


