const datosGraficos = {
  Adopciones: [120, 156, 138, 186, 214, 198],
  Citas: [92, 128, 115, 146, 168, 154],
  Ventas: [78, 104, 122, 118, 164, 188]
};

const operacionesPorSeccion = {
  clientes: [
    { nombre: 'Registrar cliente', icono: 'bi-person-plus', clase: 'operacion-registrar', descripcion: 'Crear una ficha de cliente', href: 'RegistrarCliente.html' },
    { nombre: 'Ver lista de clientes', icono: 'bi-people', clase: 'operacion-lista', descripcion: 'Consultar todos los clientes', href: 'ListasClientes.html' },
    { nombre: 'Modificar cliente', icono: 'bi-pencil-square', clase: 'operacion-modificar', descripcion: 'Actualizar sus datos', href: 'ModificarCliente.html' },
    { nombre: 'Eliminar cliente', icono: 'bi-person-x', clase: 'operacion-eliminar', descripcion: 'Retirar un cliente', href: 'EliminarCliente.html' }
  ],
  mascotas: [
    { nombre: 'Registrar mascota', icono: 'bi-heart-fill', clase: 'operacion-registrar', descripcion: 'Crear una ficha de mascota', href: 'RegistrarMascota.html' },
    { nombre: 'Ver lista de mascotas', icono: 'bi-list-heart', clase: 'operacion-lista', descripcion: 'Consultar mascotas disponibles', href: 'ListasMascotas.html' },
    { nombre: 'Modificar mascota', icono: 'bi-pencil-square', clase: 'operacion-modificar', descripcion: 'Actualizar su información', href: 'ModificarMascota.html' },
    { nombre: 'Eliminar mascota', icono: 'bi-heartbreak', clase: 'operacion-eliminar', descripcion: 'Retirar una mascota', href: 'EliminarMascota.html' }
  ],
  productos: [
    { nombre: 'Registrar producto', icono: 'bi-box-seam', clase: 'operacion-registrar', descripcion: 'Añadir un producto al inventario', href: 'RegistrarProducto.html' },
    { nombre: 'Ver lista de productos', icono: 'bi-list-ul', clase: 'operacion-lista', descripcion: 'Consultar el inventario', href: 'ListasProductos.html' },
    { nombre: 'Modificar producto', icono: 'bi-pencil-square', clase: 'operacion-modificar', descripcion: 'Actualizar sus datos', href: 'ModificarProducto.html' },
    { nombre: 'Eliminar producto', icono: 'bi-trash3', clase: 'operacion-eliminar', descripcion: 'Retirar un producto', href: 'EliminarProducto.html' }
  ],
  pedidos: [
    { nombre: 'Registrar pedido', icono: 'bi-cart-plus', clase: 'operacion-registrar', descripcion: 'Crear un nuevo pedido', href: 'RegistrarPedido.html' },
    { nombre: 'Ver lista de pedidos', icono: 'bi-card-list', clase: 'operacion-lista', descripcion: 'Consultar pedidos realizados', href: 'ListasPedido.html' },
    { nombre: 'Modificar pedido', icono: 'bi-pencil-square', clase: 'operacion-modificar', descripcion: 'Actualizar un pedido', href: 'ModificarPedido.html' },
    { nombre: 'Eliminar pedido', icono: 'bi-cart-x', clase: 'operacion-eliminar', descripcion: 'Cancelar un pedido', href: 'EliminarPedido.html' }
  ],
  citas: [
    { nombre: 'Registrar cita', icono: 'bi-calendar-plus', clase: 'operacion-registrar', descripcion: 'Agendar una nueva cita', href: 'RegistrarCita.html' },
    { nombre: 'Ver lista de citas', icono: 'bi-calendar3', clase: 'operacion-lista', descripcion: 'Consultar la agenda', href: 'ListasCitas.html' },
    { nombre: 'Modificar cita', icono: 'bi-pencil-square', clase: 'operacion-modificar', descripcion: 'Cambiar sus datos', href: 'ModificarCita.html' },
    { nombre: 'Eliminar cita', icono: 'bi-calendar-x', clase: 'operacion-eliminar', descripcion: 'Cancelar una cita', href: 'EliminarCita.html' }
  ]
};

function construirOperaciones() {
  document.querySelectorAll('[data-operaciones]').forEach((contenedor) => {
    const seccion = contenedor.dataset.operaciones;
    const operaciones = operacionesPorSeccion[seccion] || [];
    contenedor.innerHTML = operaciones.map((operacion) => `
      <div class="col-12 col-sm-6">
        <a class="tarjeta-operacion ${operacion.clase}" href="${operacion.href}">
          <i class="bi ${operacion.icono}"></i>
          <span><strong>${operacion.nombre}</strong><small>${operacion.descripcion}</small></span>
          <i class="bi bi-arrow-up-right flecha-operacion"></i>
        </a>
      </div>
    `).join('');
  });
}

function crearGraficos() {
  const lienzoBarras = document.getElementById('graficoBarras');
  const lienzoDona = document.getElementById('graficoDona');
  if (!lienzoBarras || !lienzoDona || typeof Chart === 'undefined') return;

  const graficoBarras = new Chart(lienzoBarras, {
    type: 'bar',
    data: {
      labels: ['Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre'],
      datasets: [{ label: 'Adopciones realizadas', data: datosGraficos.Adopciones, backgroundColor: '#2d8cff', borderRadius: 7, borderSkipped: false, barThickness: 24 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#102a43', padding: 12, displayColors: false } },
      scales: { y: { beginAtZero: true, grid: { color: '#e7eef4' }, ticks: { color: '#718096', font: { family: 'DM Sans' } } }, x: { grid: { display: false }, ticks: { color: '#718096', font: { family: 'DM Sans' } } } }
    }
  });

  new Chart(lienzoDona, {
    type: 'doughnut',
    data: { labels: ['Perros', 'Gatos', 'Otros'], datasets: [{ data: [55, 31, 14], backgroundColor: ['#2d8cff', '#18b892', '#ffad36'], borderWidth: 0, hoverOffset: 7 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false }, tooltip: { backgroundColor: '#102a43', padding: 12 } } }
  });

  document.querySelectorAll('[data-filtro]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const filtro = boton.dataset.filtro;
      if (!filtro || !datosGraficos[filtro]) return;
      document.querySelectorAll('[data-filtro]').forEach((elemento) => elemento.classList.remove('filtro-activo'));
      boton.classList.add('filtro-activo');
      graficoBarras.data.datasets[0].data = datosGraficos[filtro];
      graficoBarras.data.datasets[0].label = `${filtro} del periodo`;
      graficoBarras.update();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  construirOperaciones();
  crearGraficos();
});