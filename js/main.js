(async function() {
  'use strict';

  const pantallaCarga = document.getElementById('pantallaCarga');
  const lineasCarga = document.querySelectorAll('.pantalla-carga__linea');
  const cursorCarga = document.querySelector('.pantalla-carga__linea-cursor');
  const textoCarga = document.getElementById('textoCarga');
  const textoSaludo = document.getElementById('textoSaludo');
  const mensajesCarga = ['_SISTEMA_INIT_', 'Bienvenido a mi espacio.'];

  if (pantallaCarga) {
    lineasCarga.forEach((linea) => {
      const retraso = parseInt(linea.dataset.retraso) || 0;
      setTimeout(() => linea.classList.add('visible'), retraso);
    });

    setTimeout(() => {
      cursorCarga.classList.add('visible');
      typeText(textoCarga, 'Sistema listo. Iniciando interfaz...', () => {
        setTimeout(() => {
          pantallaCarga.classList.add('oculta');
          document.body.style.overflow = '';
          if (textoSaludo) {
            setTimeout(() => {
              typeText(textoSaludo, mensajesCarga[0], () => {
                setTimeout(() => {
                  textoSaludo.textContent = '';
                  typeText(textoSaludo, mensajesCarga[1]);
                }, 1200);
              });
            }, 600);
          }
        }, 800);
      });
    }, 5200);
  }

  function typeText(el, texto, callback) {
    if (!el) return;
    let i = 0;
    el.textContent = '';
    function tick() {
      if (i < texto.length) {
        el.textContent += texto.charAt(i);
        i++;
        requestAnimationFrame(() => setTimeout(tick, 25 + Math.random() * 15));
      } else if (callback) {
        callback();
      }
    }
    tick();
  }

  window.dispatchEvent(new Event('datosCargados'));

  const roles = document.querySelectorAll('.inicio__rol');
  if (roles.length > 1) {
    let indiceRol = 0;
    setInterval(() => {
      roles.forEach(r => r.classList.remove('activo'));
      indiceRol = (indiceRol + 1) % roles.length;
      roles[indiceRol].classList.add('activo');
    }, 3000);
  }

  const valorPing = document.getElementById('valorPing');
  if (valorPing) {
    setInterval(() => valorPing.textContent = Math.floor(Math.random() * 15 + 2), 2000);
  }

  const textoSobreMi = document.getElementById('textoSobreMi');
  if (textoSobreMi) {
    const observadorSobreMi = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          const texto = textoSobreMi.textContent;
          if (!textoSobreMi.dataset.tipeado) {
            textoSobreMi.dataset.tipeado = 'true';
            typeText(textoSobreMi, texto);
          }
          observadorSobreMi.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.3 });
    observadorSobreMi.observe(textoSobreMi);
  }

  const numerosEstadisticas = document.querySelectorAll('.sobre-mi__estat-numero');
  const observadorEstadisticas = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        const el = entrada.target;
        const objetivo = parseInt(el.textContent);
        if (!el.dataset.contado) {
          el.dataset.contado = 'true';
          animarContador(el, objetivo);
        }
        observadorEstadisticas.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  numerosEstadisticas.forEach(el => observadorEstadisticas.observe(el));

  function animarContador(el, objetivo) {
    let actual = 0;
    const paso = Math.max(1, Math.ceil(objetivo / 40));
    function tick() {
      actual += paso;
      if (actual >= objetivo) {
        el.textContent = objetivo + '+';
        return;
      }
      el.textContent = actual;
      requestAnimationFrame(() => setTimeout(tick, 40));
    }
    tick();
  }

  const observadorAnimacion = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        observadorAnimacion.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.animar-aparicion').forEach(el => observadorAnimacion.observe(el));

  const secciones = document.querySelectorAll('.seccion');
  const enlacesNav = document.querySelectorAll('.barra-navegacion__enlace');
  const barraNavegacion = document.getElementById('barraNavegacion');
  let navTicking = false;

  function actualizarSeccionActiva() {
    let actual = 'inicio';
    secciones.forEach(seccion => {
      if (seccion.getBoundingClientRect().top <= 200) actual = seccion.id;
    });
    enlacesNav.forEach(enlace => enlace.classList.toggle('activo', enlace.dataset.seccion === actual));
    navTicking = false;
  }

  window.addEventListener('scroll', () => {
    barraNavegacion.classList.toggle('scrolled', window.scrollY > 100);
    if (!navTicking) { requestAnimationFrame(actualizarSeccionActiva); navTicking = true; }
  });

  const botonMenu = document.getElementById('botonMenu');
  const enlacesContenedor = document.getElementById('enlacesNavegacion');
  if (botonMenu) {
    botonMenu.addEventListener('click', () => enlacesContenedor.classList.toggle('abierto'));
    enlacesNav.forEach(enlace => enlace.addEventListener('click', () => enlacesContenedor.classList.remove('abierto')));
  }

  const barraProgreso = document.getElementById('barraProgreso');
  if (barraProgreso) {
    let pTicking = false;
    window.addEventListener('scroll', () => {
      if (!pTicking) {
        requestAnimationFrame(() => {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          barraProgreso.style.width = (docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0) + '%';
          pTicking = false;
        });
        pTicking = true;
      }
    });
  }

  const botonVolverArriba = document.getElementById('botonVolverArriba');
  if (botonVolverArriba) {
    let bTicking = false;
    window.addEventListener('scroll', () => {
      if (!bTicking) {
        requestAnimationFrame(() => {
          botonVolverArriba.classList.toggle('visible', window.scrollY > 500);
          bTicking = false;
        });
        bTicking = true;
      }
    });
    botonVolverArriba.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  let atajosVisibles = false;
  const pistaAtajos = document.getElementById('pistaAtajos');
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const tecla = parseInt(e.key);
    if (tecla >= 1 && tecla <= 7) {
      e.preventDefault();
      const mapa = ['inicio', 'sobre-mi', 'habilidades', 'experiencia', 'proyectos', 'educacion', 'contacto'];
      const objetivo = document.getElementById(mapa[tecla - 1]);
      if (objetivo) objetivo.scrollIntoView({ behavior: 'smooth' });
    }
    if (e.key === '?' && pistaAtajos) {
      atajosVisibles = !atajosVisibles;
      pistaAtajos.classList.toggle('visible', atajosVisibles);
    }
  });

  const formularioContacto = document.getElementById('formularioContacto');
  const estadoFormulario = document.getElementById('estadoFormulario');
  const botonEnviar = document.getElementById('botonEnviar');

  if (formularioContacto) {
    formularioContacto.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = document.getElementById('formNombre').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const mensaje = document.getElementById('formMensaje').value.trim();

      if (!nombre || !email || !mensaje) {
        estadoFormulario.textContent = '! Todos los campos son obligatorios';
        estadoFormulario.style.color = 'var(--acento)';
        return;
      }

      botonEnviar.querySelector('.formulario__enviar-texto').style.display = 'none';
      botonEnviar.querySelector('.formulario__enviar-carga').style.display = 'inline';
      estadoFormulario.textContent = 'Enviando...';
      estadoFormulario.style.color = 'var(--neon)';

      try {
        const respuesta = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: nombre, email, message: mensaje })
        });

        if (respuesta.ok) {
          estadoFormulario.textContent = '! Mensaje enviado con éxito';
          estadoFormulario.style.color = 'var(--neon)';
          formularioContacto.reset();
        } else {
          estadoFormulario.textContent = '! Error al enviar. Verifica los datos.';
          estadoFormulario.style.color = 'var(--acento)';
        }
      } catch (err) {
        estadoFormulario.textContent = '! Error de conexión. Intenta de nuevo.';
        estadoFormulario.style.color = 'var(--acento)';
      }

      botonEnviar.querySelector('.formulario__enviar-texto').style.display = 'inline';
      botonEnviar.querySelector('.formulario__enviar-carga').style.display = 'none';
      setTimeout(() => estadoFormulario.textContent = '', 5000);
    });
  }

  /* === FUNCIONES GLOBALES PARA MODAL === */
  window.abrirProyecto = function(proyecto) {
    const modal = document.getElementById('modalProyecto');
    if (!modal) return;

    document.getElementById('tituloModal').textContent = proyecto.title;
    document.getElementById('descripcionModal').textContent = proyecto.description;

    const techModal = document.getElementById('tecnologiasModal');
    techModal.innerHTML = '';
    proyecto.tech.forEach(function(t) {
      const span = document.createElement('span');
      span.textContent = t;
      techModal.appendChild(span);
    });

    const destacados = document.getElementById('destacadosModal');
    destacados.innerHTML = '';
    proyecto.highlights.forEach(function(h) {
      const li = document.createElement('li');
      li.textContent = h;
      destacados.appendChild(li);
    });

    document.getElementById('enlaceModal').href = proyecto.url;
    modal.classList.add('activa');
    document.body.style.overflow = 'hidden';
  };

  window.cerrarModal = function() {
    const modal = document.getElementById('modalProyecto');
    if (!modal) return;
    modal.classList.remove('activa');
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') window.cerrarModal();
  });
})();
