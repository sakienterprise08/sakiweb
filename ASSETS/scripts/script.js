const datosGraficos = {
  Adopciones: [120, 156, 138, 186, 214, 198],
  Citas: [92, 128, 115, 146, 168, 154],
  Ventas: [78, 104, 122, 118, 164, 188]
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