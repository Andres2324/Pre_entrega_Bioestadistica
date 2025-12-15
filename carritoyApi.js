// ================================
// CONFIGURACIÓN GENERAL
// ================================
const API_URL = "https://fakestoreapi.com/products";

const contenedorProductos = document.getElementById("productos");
const contadorCarrito = document.getElementById("contadorCarrito");
const listaCarrito = document.getElementById("listaCarrito");
const totalCarrito = document.getElementById("totalCarrito");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ================================
// FETCH API – OBTENER PRODUCTOS
// ================================
async function cargarProductos() {
  try {
    const response = await fetch(API_URL);
    const productos = await response.json();
    mostrarProductos(productos.slice(0, 6)); // limitamos cantidad
  } catch (error) {
    contenedorProductos.innerHTML = "<p>Error al cargar productos</p>";
  }
}

// ================================
// RENDERIZAR PRODUCTOS
// ================================
function mostrarProductos(productos) {
  contenedorProductos.innerHTML = "";

  productos.forEach(producto => {
    const card = document.createElement("div");
    card.className = "card producto";

    card.innerHTML = `
      <img src="${producto.image}" class="card-img-top" alt="${producto.title}">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${producto.title}</h5>
        <p class="card-text">$${producto.price}</p>
        <button class="btn btn-primary mt-auto">Agregar al carrito</button>
      </div>
    `;

    card.querySelector("button").addEventListener("click", () => {
      agregarAlCarrito(producto);
    });

    contenedorProductos.appendChild(card);
  });
}

// ================================
// CARRITO DE COMPRAS
// ================================
function agregarAlCarrito(producto) {
  const existe = carrito.find(item => item.id === producto.id);

  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito();
  actualizarCarrito();
}

function eliminarProducto(id) {
  carrito = carrito.filter(item => item.id !== id);
  guardarCarrito();
  actualizarCarrito();
}

function cambiarCantidad(id, cantidad) {
  const producto = carrito.find(item => item.id === id);
  producto.cantidad = Number(cantidad);
  guardarCarrito();
  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach(item => {
    total += item.price * item.cantidad;

    listaCarrito.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong>${item.title}</strong><br>
          $${item.price}
        </div>
        <input type="number" min="1" value="${item.cantidad}" 
          onchange="cambiarCantidad(${item.id}, this.value)">
        <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${item.id})">X</button>
      </li>
    `;
  });

  totalCarrito.textContent = `Total: $${total.toFixed(2)}`;
  contadorCarrito.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ================================
// VALIDACIÓN FORMULARIO CONTACTO
// ================================
const formulario = document.getElementById("formContacto");

if (formulario) {
  formulario.addEventListener("submit", function (e) {
    const email = document.getElementById("email").value;

    if (!email.includes("@")) {
      e.preventDefault();
      alert("Por favor ingrese un correo válido");
    }
  });
}

// ================================
// INICIALIZACIÓN
// ================================
actualizarCarrito();
cargarProductos();
