(function() {
  const canvas = document.getElementById('lienzoParticulas');
  if (!canvas) return;

  const esMovil = window.innerWidth < 768;
  const CANTIDAD_PARTICULAS = esMovil ? 60 : 180;
  const DISTANCIA_CONEXION = esMovil ? 150 : 120;

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderizador = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: !esMovil
  });

  const dpr = Math.min(window.devicePixelRatio, 2);
  renderizador.setSize(window.innerWidth, window.innerHeight);
  renderizador.setPixelRatio(dpr);

  const geometria = new THREE.BufferGeometry();
  const posiciones = new Float32Array(CANTIDAD_PARTICULAS * 3);
  const velocidades = new Float32Array(CANTIDAD_PARTICULAS * 2);

  for (let i = 0; i < CANTIDAD_PARTICULAS; i++) {
    posiciones[i * 3] = (Math.random() - 0.5) * 1000;
    posiciones[i * 3 + 1] = (Math.random() - 0.5) * 700;
    posiciones[i * 3 + 2] = (Math.random() - 0.5) * 500;
    velocidades[i * 2] = (Math.random() - 0.5) * 0.05;
    velocidades[i * 2 + 1] = (Math.random() - 0.5) * 0.05;
  }

  geometria.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));

  const colores = [0x00ffcc, 0x8a2be2, 0xff2a75];
  const colorActual = colores[Math.floor(Math.random() * colores.length)];

  const material = new THREE.PointsMaterial({
    size: esMovil ? 1.8 : 2.5,
    color: colorActual,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });

  const particulas = new THREE.Points(geometria, material);
  escena.add(particulas);

  let mouseX = 0, mouseY = 0;
  let targetRotX = 0, targetRotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  camara.position.z = 400;

  const materialLinea = new THREE.LineBasicMaterial({
    color: 0x00ffcc,
    transparent: true,
    opacity: esMovil ? 0.04 : 0.08
  });

  let mallaLinea = null;
  let ultimaConexion = 0;

  function reconstruirConexiones() {
    const pos = geometria.attributes.position.array;
    const conexiones = [];

    for (let i = 0; i < CANTIDAD_PARTICULAS; i++) {
      for (let j = i + 1; j < CANTIDAD_PARTICULAS; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < DISTANCIA_CONEXION * DISTANCIA_CONEXION) {
          conexiones.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
          conexiones.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
        }
      }
    }

    if (mallaLinea) {
      escena.remove(mallaLinea);
      mallaLinea.geometry.dispose();
      mallaLinea = null;
    }

    if (conexiones.length) {
      const lineaGeo = new THREE.BufferGeometry();
      lineaGeo.setAttribute('position', new THREE.Float32BufferAttribute(conexiones, 3));
      mallaLinea = new THREE.LineSegments(lineaGeo, materialLinea);
      escena.add(mallaLinea);
    }
  }

  reconstruirConexiones();

  let conteoFrames = 0;

  function animar() {
    requestAnimationFrame(animar);

    const pos = geometria.attributes.position.array;
    const tiempo = Date.now() * 0.0003;

    for (let i = 0; i < CANTIDAD_PARTICULAS; i++) {
      pos[i * 3] += Math.sin(tiempo + i * 0.5) * 0.08 + velocidades[i * 2];
      pos[i * 3 + 1] += Math.cos(tiempo * 1.3 + i * 0.3) * 0.08 + velocidades[i * 2 + 1];
    }

    geometria.attributes.position.needsUpdate = true;

    targetRotX += (mouseY * 0.01 - targetRotX) * 0.02;
    targetRotY += (mouseX * 0.01 - targetRotY) * 0.02;
    particulas.rotation.x = targetRotX;
    particulas.rotation.y = targetRotY;

    if (!esMovil) {
      conteoFrames++;
      if (conteoFrames % 60 === 0 && Date.now() - ultimaConexion > 2000) {
        reconstruirConexiones();
        ultimaConexion = Date.now();
      }
    }

    renderizador.render(escena, camara);
  }

  animar();

  let timeoutResize;
  window.addEventListener('resize', () => {
    clearTimeout(timeoutResize);
    timeoutResize = setTimeout(() => {
      camara.aspect = window.innerWidth / window.innerHeight;
      camara.updateProjectionMatrix();
      renderizador.setSize(window.innerWidth, window.innerHeight);
    }, 200);
  });
})();
