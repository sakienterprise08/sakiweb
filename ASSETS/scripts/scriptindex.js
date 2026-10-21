document.addEventListener('DOMContentLoaded', () => {
  // Inicialización o interacción personalizada
  console.log('Plataforma SAKI cargada con éxito.');

  // Auto-activación del carrusel si no tuviera el atributo de Bootstrap
  const carruselElemento = document.querySelector('#carruselPrincipal');
  if (carruselElemento && window.bootstrap) {
    new bootstrap.Carousel(carruselElemento, {
      interval: 5000,
      ride: 'carousel'
    });
  }
});