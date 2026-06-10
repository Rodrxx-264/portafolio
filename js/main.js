(async function() {
  'use strict';

  var isMobile = window.innerWidth < 768;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var pantallaCarga = document.getElementById('pantallaCarga');
  var lineasCarga = document.querySelectorAll('.pantalla-carga__linea');
  var cursorCarga = document.querySelector('.pantalla-carga__linea-cursor');
  var textoCarga = document.getElementById('textoCarga');
  var textoSaludo = document.getElementById('textoSaludo');
  var mensajesCarga = ['_SISTEMA_INIT_', 'Bienvenido a mi espacio.'];

  if (pantallaCarga) {
    if (isMobile || prefersReducedMotion) {
      pantallaCarga.classList.add('oculta');
      document.body.style.overflow = '';
      if (textoSaludo) {
        textoSaludo.textContent = mensajesCarga[1];
      }
    } else {
      lineasCarga.forEach(function(linea) {
        var retraso = parseInt(linea.dataset.retraso) || 0;
        setTimeout(function() { linea.classList.add('visible'); }, retraso);
      });

      setTimeout(function() {
        cursorCarga.classList.add('visible');
        typeText(textoCarga, 'Sistema listo. Iniciando interfaz...', function() {
          setTimeout(function() {
            pantallaCarga.classList.add('oculta');
            document.body.style.overflow = '';
            if (textoSaludo) {
              setTimeout(function() {
                typeText(textoSaludo, mensajesCarga[0], function() {
                  setTimeout(function() {
                    textoSaludo.textContent = '';
                    typeText(textoSaludo, mensajesCarga[1]);
                  }, 1200);
                });
              }, 600);
            }
          }, 800);
        });
      }, isMobile ? 1200 : 5200);
    }
  }

  function typeText(el, texto, callback) {
    if (!el) return;
    var i = 0;
    el.textContent = '';
    function tick() {
      if (i < texto.length) {
        el.textContent += texto.charAt(i);
        i++;
        requestAnimationFrame(function() { setTimeout(tick, 25 + Math.random() * 15); });
      } else if (callback) {
        callback();
      }
    }
    tick();
  }

  window.dispatchEvent(new Event('datosCargados'));

  var roles = document.querySelectorAll('.inicio__rol');
  if (roles.length > 1) {
    var indiceRol = 0;
    setInterval(function() {
      roles.forEach(function(r) { r.classList.remove('activo'); });
      indiceRol = (indiceRol + 1) % roles.length;
      roles[indiceRol].classList.add('activo');
    }, 3000);
  }

  var valorPing = document.getElementById('valorPing');
  if (valorPing) {
    setInterval(function() { valorPing.textContent = Math.floor(Math.random() * 15 + 2); }, 2000);
  }

  var textoSobreMi = document.getElementById('textoSobreMi');
  if (textoSobreMi) {
    var observadorSobreMi = new IntersectionObserver(function(entradas) {
      entradas.forEach(function(entrada) {
        if (entrada.isIntersecting) {
          if (!textoSobreMi.dataset.tipeado) {
            textoSobreMi.dataset.tipeado = 'true';
          }
          observadorSobreMi.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.3 });
    observadorSobreMi.observe(textoSobreMi);
  }

  var numerosEstadisticas = document.querySelectorAll('.sobre-mi__estat-numero');
  var observadorEstadisticas = new IntersectionObserver(function(entradas) {
    entradas.forEach(function(entrada) {
      if (entrada.isIntersecting) {
        var el = entrada.target;
        var objetivo = parseInt(el.textContent);
        if (!el.dataset.contado) {
          el.dataset.contado = 'true';
          animarContador(el, objetivo);
        }
        observadorEstadisticas.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  numerosEstadisticas.forEach(function(el) { observadorEstadisticas.observe(el); });

  function animarContador(el, objetivo) {
    var actual = 0;
    var paso = Math.max(1, Math.ceil(objetivo / 30));
    function tick() {
      actual += paso;
      if (actual >= objetivo) {
        el.textContent = objetivo + '+';
        return;
      }
      el.textContent = actual;
      requestAnimationFrame(function() { setTimeout(tick, 40); });
    }
    tick();
  }

  var observadorAnimacion = new IntersectionObserver(function(entradas) {
    entradas.forEach(function(entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        observadorAnimacion.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.animar-aparicion').forEach(function(el) { observadorAnimacion.observe(el); });

  var secciones = document.querySelectorAll('.seccion');
  var enlacesNav = document.querySelectorAll('.barra-navegacion__enlace');
  var barraNavegacion = document.getElementById('barraNavegacion');
  var navTicking = false;

  function actualizarSeccionActiva() {
    var actual = 'inicio';
    secciones.forEach(function(seccion) {
      if (seccion.getBoundingClientRect().top <= 200) actual = seccion.id;
    });
    enlacesNav.forEach(function(enlace) { enlace.classList.toggle('activo', enlace.dataset.seccion === actual); });
    navTicking = false;
  }

  window.addEventListener('scroll', function() {
    barraNavegacion.classList.toggle('scrolled', window.scrollY > 80);
    if (!navTicking) { requestAnimationFrame(actualizarSeccionActiva); navTicking = true; }
  }, { passive: true });

  var botonMenu = document.getElementById('botonMenu');
  var enlacesContenedor = document.getElementById('enlacesNavegacion');
  if (botonMenu) {
    botonMenu.addEventListener('click', function() {
      enlacesContenedor.classList.toggle('abierto');
      botonMenu.classList.toggle('abierto');
      document.body.style.overflow = enlacesContenedor.classList.contains('abierto') ? 'hidden' : '';
    });
    enlacesNav.forEach(function(enlace) {
      enlace.addEventListener('click', function() {
        enlacesContenedor.classList.remove('abierto');
        botonMenu.classList.remove('abierto');
        document.body.style.overflow = '';
      });
    });
  }

  var barraProgreso = document.getElementById('barraProgreso');
  if (barraProgreso) {
    var pTicking = false;
    window.addEventListener('scroll', function() {
      if (!pTicking) {
        requestAnimationFrame(function() {
          var docHeight = document.documentElement.scrollHeight - window.innerHeight;
          barraProgreso.style.width = (docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0) + '%';
          pTicking = false;
        });
        pTicking = true;
      }
    }, { passive: true });
  }

  var botonVolverArriba = document.getElementById('botonVolverArriba');
  if (botonVolverArriba) {
    var bTicking = false;
    window.addEventListener('scroll', function() {
      if (!bTicking) {
        requestAnimationFrame(function() {
          botonVolverArriba.classList.toggle('visible', window.scrollY > 400);
          bTicking = false;
        });
        bTicking = true;
      }
    }, { passive: true });
    botonVolverArriba.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  var atajosVisibles = false;
  var pistaAtajos = document.getElementById('pistaAtajos');
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    var tecla = parseInt(e.key);
    if (tecla >= 1 && tecla <= 7) {
      e.preventDefault();
      var mapa = ['inicio', 'sobre-mi', 'habilidades', 'experiencia', 'proyectos', 'educacion', 'contacto'];
      var objetivo = document.getElementById(mapa[tecla - 1]);
      if (objetivo) objetivo.scrollIntoView({ behavior: 'smooth' });
    }
    if (e.key === '?' && pistaAtajos) {
      atajosVisibles = !atajosVisibles;
      pistaAtajos.classList.toggle('visible', atajosVisibles);
    }
  });

  var formularioContacto = document.getElementById('formularioContacto');
  var estadoFormulario = document.getElementById('estadoFormulario');
  var botonEnviar = document.getElementById('botonEnviar');

  if (formularioContacto) {
    formularioContacto.addEventListener('submit', async function(e) {
      e.preventDefault();
      var nombre = document.getElementById('formNombre').value.trim();
      var email = document.getElementById('formEmail').value.trim();
      var mensaje = document.getElementById('formMensaje').value.trim();

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
        var respuesta = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: nombre, email: email, message: mensaje })
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
      setTimeout(function() { estadoFormulario.textContent = ''; }, 5000);
    });
  }

  window.abrirProyecto = function(proyecto) {
    var modal = document.getElementById('modalProyecto');
    if (!modal) return;

    document.getElementById('tituloModal').textContent = proyecto.title;
    document.getElementById('descripcionModal').textContent = proyecto.description;

    var techModal = document.getElementById('tecnologiasModal');
    techModal.innerHTML = '';
    proyecto.tech.forEach(function(t) {
      var span = document.createElement('span');
      span.textContent = t;
      techModal.appendChild(span);
    });

    var destacados = document.getElementById('destacadosModal');
    destacados.innerHTML = '';
    proyecto.highlights.forEach(function(h) {
      var li = document.createElement('li');
      li.textContent = h;
      destacados.appendChild(li);
    });

    document.getElementById('enlaceModal').href = proyecto.url;
    modal.classList.add('activa');
    document.body.style.overflow = 'hidden';
  };

  window.cerrarModal = function() {
    var modal = document.getElementById('modalProyecto');
    if (!modal) return;
    modal.classList.remove('activa');
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') window.cerrarModal();
  });

  var modalCapa = document.getElementById('cierreCapaModal');
  if (modalCapa) {
    modalCapa.addEventListener('click', window.cerrarModal);
  }
})();
