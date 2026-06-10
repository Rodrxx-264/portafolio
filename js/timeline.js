window.addEventListener('datosCargados', function() {
  const envoltura = document.getElementById('envolturaLineaTiempo');
  const pista = document.getElementById('pistaLineaTiempo');
  if (!envoltura || !pista) return;

  let arrastrando = false;
  let startX, scrollLeft;

  envoltura.addEventListener('mousedown', (e) => {
    arrastrando = true;
    startX = e.pageX - envoltura.offsetLeft;
    scrollLeft = envoltura.scrollLeft;
    envoltura.style.cursor = 'grabbing';
  });

  envoltura.addEventListener('mouseleave', () => {
    arrastrando = false;
    envoltura.style.cursor = 'grab';
  });

  envoltura.addEventListener('mouseup', () => {
    arrastrando = false;
    envoltura.style.cursor = 'grab';
  });

  envoltura.addEventListener('mousemove', (e) => {
    if (!arrastrando) return;
    e.preventDefault();
    const x = e.pageX - envoltura.offsetLeft;
    const distancia = (x - startX) * 1.5;
    envoltura.scrollLeft = scrollLeft - distancia;
  });

  envoltura.addEventListener('wheel', (e) => {
    const tieneDesbordamiento = envoltura.scrollWidth > envoltura.clientWidth;
    if (tieneDesbordamiento && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      envoltura.scrollLeft += e.deltaY;
    }
  }, { passive: false });

  // Update line progress
  const barraLinea = document.getElementById('barraLineaTiempo');
  if (barraLinea) {
    const actualizarLinea = () => {
      const maxScroll = pista.scrollWidth - envoltura.clientWidth;
      const progreso = maxScroll > 0 ? (envoltura.scrollLeft / maxScroll) * 100 : 0;
      const anchoTotal = pista.scrollWidth - 96;
      barraLinea.style.width = Math.min(progreso * (anchoTotal / 100), anchoTotal) + 'px';
    };

    envoltura.addEventListener('scroll', () => {
      requestAnimationFrame(actualizarLinea);
    });
    setTimeout(actualizarLinea, 100);
  }
});
