window.addEventListener('datosCargados', function() {
  var envoltura = document.getElementById('envolturaLineaTiempo');
  var pista = document.getElementById('pistaLineaTiempo');
  if (!envoltura || !pista) return;

  var arrastrando = false;
  var startX, scrollLeft;

  var empezarArrastre = function(e) {
    arrastrando = true;
    startX = ('touches' in e ? e.touches[0].pageX : e.pageX) - envoltura.offsetLeft;
    scrollLeft = envoltura.scrollLeft;
    envoltura.style.cursor = 'grabbing';
  };

  var terminarArrastre = function() {
    arrastrando = false;
    envoltura.style.cursor = 'grab';
  };

  var moverArrastre = function(e) {
    if (!arrastrando) return;
    e.preventDefault();
    var x = ('touches' in e ? e.touches[0].pageX : e.pageX) - envoltura.offsetLeft;
    var distancia = (x - startX) * 1.5;
    envoltura.scrollLeft = scrollLeft - distancia;
  };

  envoltura.addEventListener('mousedown', empezarArrastre);
  envoltura.addEventListener('mouseleave', terminarArrastre);
  envoltura.addEventListener('mouseup', terminarArrastre);
  envoltura.addEventListener('mousemove', moverArrastre);

  envoltura.addEventListener('touchstart', empezarArrastre, { passive: true });
  envoltura.addEventListener('touchend', terminarArrastre);
  envoltura.addEventListener('touchcancel', terminarArrastre);
  envoltura.addEventListener('touchmove', moverArrastre, { passive: false });

  envoltura.addEventListener('wheel', function(e) {
    var tieneDesbordamiento = envoltura.scrollWidth > envoltura.clientWidth;
    if (tieneDesbordamiento && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      envoltura.scrollLeft += e.deltaY;
    }
  }, { passive: false });

  var barraLinea = document.getElementById('barraLineaTiempo');
  if (barraLinea) {
    var actualizarLinea = function() {
      var maxScroll = pista.scrollWidth - envoltura.clientWidth;
      var progreso = maxScroll > 0 ? (envoltura.scrollLeft / maxScroll) * 100 : 0;
      var anchoTotal = pista.scrollWidth - 40;
      barraLinea.style.width = Math.min(progreso * (anchoTotal / 100), anchoTotal) + 'px';
    };

    envoltura.addEventListener('scroll', function() {
      requestAnimationFrame(actualizarLinea);
    }, { passive: true });
    setTimeout(actualizarLinea, 100);
  }
});
