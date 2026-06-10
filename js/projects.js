window.addEventListener('datosCargados', function() {
  const tarjetas = document.querySelectorAll('.proyecto__tarjeta');
  if (!tarjetas.length) return;

  tarjetas.forEach(tarjeta => {
    let ticking = false;
    let rect;

    tarjeta.addEventListener('mouseenter', () => {
      rect = tarjeta.getBoundingClientRect();
    });

    tarjeta.addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!rect) rect = tarjeta.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = (y - centerY) / centerY * -10;
          const rotateY = (x - centerX) / centerX * 10;

          const inner = tarjeta.querySelector('.proyecto__tarjeta-interna');
          if (inner) {
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    });

    tarjeta.addEventListener('mouseleave', () => {
      rect = null;
      const inner = tarjeta.querySelector('.proyecto__tarjeta-interna');
      if (inner) {
        inner.style.transform = 'rotateX(0) rotateY(0)';
      }
    });
  });
});
