/* ==========================================================================
   1) BASE DE DATOS DE PRODUCTOS
   ========================================================================== */

// Array de objetos que simula el inventario de herramientas de la bulonera.
let productos = [
    { nombre: "Taladro", precio: 45000 },
    { nombre: "Destornillador eléctrico", precio: 35000 },
    { nombre: "Amoladora angular", precio: 40000 },
    { nombre: "Soldadora eléctrica", precio: 120000 },
    { nombre: "Caladora", precio: 42000 },
    { nombre: "Sierra circular", precio: 87000 },
    { nombre: "Lijadora orbital", precio: 49000 },
    { nombre: "Fresadora de mano", precio: 84000 }
];

/* ==========================================================================
   2) MÓDULO DEL CARRITO (LÓGICA Y PERSISTENCIA)
   ========================================================================== */

// Array dinámico en memoria donde se van acumulando las herramientas elegidas.
let carrito = [];

// Clave única identificatoria para almacenar los datos dentro del navegador.
const CLAVE_CARRITO = "carrito";

// Guarda el estado del array 'carrito' actual en el almacenamiento local.
function guardarCarrito() {
    // Convierte el array de objetos a formato de texto JSON.
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

// Recupera los productos del LocalStorage al cargar la página.
function cargarCarrito() {
    let guardado = localStorage.getItem(CLAVE_CARRITO);
    // Si existen datos previos en el navegador, los vuelve a transformar en un array operativo.
    if (guardado) {
        carrito = JSON.parse(guardado);
    }
}

// Añade un nuevo producto seleccionado al array del carrito.
function agregarProducto(producto) {
    carrito.push(producto); // Inserta el objeto al final del array.
    console.log(producto.nombre + " agregado al carrito");

    // Llama a actualizar la interfaz visual para reflejar el nuevo elemento añadido.
    actualizarCarrito();
}

// Suma el precio de cada una de las herramientas presentes en el carrito.
function calcularTotal() {
    let total = 0;
    // Bucle 'for...of' que recorre cada artículo individual del carrito.
    for (let producto of carrito) {
        total += producto.precio;   // Acumulador del precio total.
    }
    return total;   // Retorna el valor final calculado.
}

// Imprime de forma ordenada la lista de compras actual dentro de la consola del desarrollador.
function mostrarCarrito() {
    console.log("Productos del carrito:");
    for (let producto of carrito) {
        console.log(producto.nombre + " - $" + producto.precio);
    }
}

/* ==========================================================================
   3) RENDERIZADO Y CONTROL DE LA INTERFAZ DE USUARIO (DOM)
   ========================================================================== */

// Dibuja en el HTML el catálogo completo de herramientas disponibles para la venta.
function mostrarProductos() {
    let lista = document.getElementById("lista-productos");
    if (!lista) return; // Control de seguridad: frena la función si no encuentra la lista en el HTML.
    
    lista.innerHTML = "";   // Limpia cualquier nodo residual en el contenedor de productos.

    // Recorre el inventario de herramientas para generar las etiquetas dinámicas.
    for (let i = 0; i < productos.length; i++) {
        let producto = productos[i];

        let item = document.createElement("li");    // Crea el elemento de lista de forma nativa.
        item.className = "producto-item";   // Le asigna la clase CSS correspondiente.

        // Inserta la estructura HTML interna inyectando las propiedades del objeto.
        // El atributo 'data-indice' guarda de forma interna la posición del producto en el array.
        item.innerHTML =
            "<span class='producto-nombre'>" + producto.nombre + "</span>" +
            "<span class='producto-precio'>$" + producto.precio + "</span>" +
            "<button class='btn-agregar' data-indice='" + i + "'>Agregar</button>";

        lista.appendChild(item);    // Agrega físicamente la tarjeta de producto dentro del contenedor visual.
    }

    // Selecciona todos los botones de compra generados e inicializa sus escuchadores de eventos.
    let botones = document.querySelectorAll(".btn-agregar");
    for (let boton of botones) {
        boton.addEventListener("click", function () {
            // Al hacer clic, extrae el número de índice que el botón tenía guardado.
            let indice = boton.getAttribute("data-indice");
            // Envía al carrito el producto exacto correspondiente a esa posición del array.
            agregarProducto(productos[indice]);
        });
    }
}

// Elimina una sola herramienta del carrito basándose en su posición exacta.
function quitarProducto(indice) {
    let producto = carrito[indice];
    carrito.splice(indice, 1);  // Corta y remueve un solo elemento en la posición del índice.
    console.log(producto.nombre + " quitado del carrito");

    // Redibuja la interfaz del carrito sin el producto removido.
    actualizarCarrito();
}

// Reinicia el carrito, eliminando todas las herramientas agregadas.
function vaciarCarrito() {
    carrito = []; // Vacía el array por completo.
    console.log("Carrito vaciado");
    actualizarCarrito();    // Redibuja el carrito para mostrar que está vacío.
}

// Sincroniza y actualiza todos los componentes visuales del carrito de compras en la pantalla.
function actualizarCarrito() {
    let listaCarrito = document.getElementById("items-carrito");
    let totalTexto = document.getElementById("total-carrito");
    let cantidadTexto = document.getElementById("cantidad-carrito");

    // Verifica que los tres contenedores existan en la página antes de continuar.
    if (!listaCarrito || !totalTexto || !cantidadTexto) return;

    listaCarrito.innerHTML = "";    // Limpia la lista previa de ítems en el carrito.

     // Evalúa si el carrito no tiene elementos para mostrar el estado por defecto.
    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<li class='carrito-vacio'>Tu carrito está vacío.</li>";
    } else {
        // En caso de tener productos, los itera uno por uno para listarlos en el componente lateral.
        for (let i = 0; i < carrito.length; i++) {
            let producto = carrito[i];

            let item = document.createElement("li");
            item.className = "carrito-item";

            // Estructura visual para cada fila del carrito con su respectivo botón de remoción (✕).
            item.innerHTML =
                "<span>" + producto.nombre + "</span>" +
                "<span class='carrito-precio'>$" + producto.precio + "</span>" +
                "<button class='btn-quitar' data-indice='" + i + "'>✕</button>";

            listaCarrito.appendChild(item);
        }

        // Asigna el evento click a cada botón de remoción (✕) de la lista.
        let botonesQuitar = document.querySelectorAll(".btn-quitar");
        for (let boton of botonesQuitar) {
            boton.addEventListener("click", function () {
                let indice = boton.getAttribute("data-indice");
                quitarProducto(indice);
            });
        }
    }
    
    // Actualiza los textos de precio final y de cantidad total de artículos.
    totalTexto.textContent = "$" + calcularTotal();
    cantidadTexto.textContent = carrito.length;

    // Guarda los cambios recientes en LocalStorage para evitar pérdidas al refrescar.
    guardarCarrito();

    // Actualiza la visualización de respaldo en la consola.
    mostrarCarrito();
}

/* ==========================================================================
   4) PROCESAMIENTO SIMULADO DE COMPRA
   ========================================================================== */

// Ejecuta la ventana emergente final utilizando la librería externa SweetAlert2.
function finalizarCompra() {
    // Si el usuario presiona pagar sin productos, interrumpe el flujo con un aviso de advertencia.
    if (carrito.length === 0) {
        Swal.fire({
            icon: "info",
            title: "Tu carrito está vacío",
            text: "Agregá productos antes de pagar.",
            confirmButtonColor: "#ff9900"
        });
        return;
    }

    // Dispara el mensaje modal de éxito confirmando el monto total acumulado.
    Swal.fire({
        icon: "success",
        title: "¡Gracias por tu compra!",
        html:
            "Total a pagar: <strong>$" + calcularTotal() + "</strong><br><br>" +
            "<small>El pago es solo una demostración, no se procesa ningún cobro.</small>",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#ff9900"
    }).then(() => {
        // Una vez que el cliente cierra el cuadro modal de SweetAlert2, el carrito se limpia automáticamente.
        vaciarCarrito();
    });
}

/* ==========================================================================
   5) INICIALIZACIÓN GENERAL DEL SISTEMA
   ========================================================================== */

// Evento global que se dispara cuando el navegador termina de construir el árbol jerárquico HTML (DOM).
document.addEventListener("DOMContentLoaded", function () {

    // 1. Recupera la sesión previa del carrito que haya quedado guardada en el equipo del usuario.
    cargarCarrito();

    // 2. Ejecuta la renderización visual inicial del catálogo de herramientas y de la barra lateral.
    mostrarProductos();
    actualizarCarrito();

    // 3. Captura los botones de control de vaciado y de pago de la barra lateral.
    let botonVaciar = document.getElementById("btn-vaciar");
    let botonPagar = document.getElementById("btn-pagar");
    
    // 4. Vincula los eventos click a sus respectivas funciones operativas si los botones existen en el HTML.
    if (botonVaciar) botonVaciar.addEventListener("click", vaciarCarrito);
    if (botonPagar) botonPagar.addEventListener("click", finalizarCompra);
});