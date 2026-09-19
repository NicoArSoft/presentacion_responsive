/**
 * presentacion.js — TFI Dante Nicolás Martínez v4.5
 * Lógica de presentación interactiva (HTML5 + CSS3 + JS puro, sin frameworks)
 * Puntero dinámico, Fullscreen Hover, Modo WCAG AAA, Carruseles Continuos e Interactividad.
 */

/* ═══════════════════════════════════════════
   ESTADO Y SELECTORES
   ═══════════════════════════════════════════ */
let actual    = 0;
let direccion = 1;

const diapositivas         = document.querySelectorAll('.diapositiva');
const indicadoresContainer = document.getElementById('indicadores');
const barra                = document.getElementById('progreso');
const slideCounter         = document.getElementById('slide-counter');
const tituloHud            = document.getElementById('titulo-actual');
const totalSlides          = diapositivas.length;

// Elementos de Cursor
const cursorDot   = document.getElementById('cursor-dot');
const cursorRing  = document.getElementById('cursor-ring');
const cursorBadge = document.getElementById('cursor-badge');

/* ═══════════════════════════════════════════
   PUNTERO DINÁMICO (CUSTOM CURSOR LERP)
   ═══════════════════════════════════════════ */
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX  = mouseX;
let ringY  = mouseY;
let isCursorMoving = false;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top  = `${mouseY}px`;
  }
  if (!isCursorMoving) {
    isCursorMoving = true;
    requestAnimationFrame(animarCursorRing);
  }
});

function animarCursorRing() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;

  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top  = `${ringY}px`;
  }
  if (cursorBadge) {
    cursorBadge.style.left = `${ringX}px`;
    cursorBadge.style.top  = `${ringY}px`;
  }

  const dist = Math.hypot(mouseX - ringX, mouseY - ringY);
  if (dist > 0.1) {
    requestAnimationFrame(animarCursorRing);
  } else {
    isCursorMoving = false;
  }
}

function setupCursorHovers() {
  const interactivos = document.querySelectorAll('button, a, .carrusel-card, .timeline-fullscreen-hover-trigger, .freecode-card, .cert-eje, .habitacion-chip, .btn-link-final, .indicador');
  interactivos.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      if (cursorBadge) {
        const hint = el.getAttribute('data-cursor-hint') || (el.tagName === 'A' ? 'Visitar ↗' : (el.classList.contains('carrusel-card') ? 'Ampliar 🔍' : 'Probar ✦'));
        cursorBadge.textContent = hint;
      }
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });
}

/* ═══════════════════════════════════════════
   SLIDE 2 — FULLSCREEN HOVER DIRECTO
   ═══════════════════════════════════════════ */
const hoverModal = document.getElementById('hover-fullscreen-overlay');

function activarHoverFullscreen() {
  if (hoverModal) hoverModal.classList.add('active');
}

function desactivarHoverFullscreen() {
  if (hoverModal) hoverModal.classList.remove('active');
}

if (hoverModal) {
  hoverModal.addEventListener('click', desactivarHoverFullscreen);
}

window.activarHoverFullscreen    = activarHoverFullscreen;
window.desactivarHoverFullscreen = desactivarHoverFullscreen;

/* ═══════════════════════════════════════════
   INICIALIZACIÓN DE INDICADORES DINÁMICOS
   ═══════════════════════════════════════════ */
diapositivas.forEach((slide, i) => {
  const ind = document.createElement('button');
  ind.classList.add('indicador');
  ind.setAttribute('aria-label', `Ir a: ${slide.dataset.titulo || 'Diapositiva ' + (i + 1)}`);
  ind.setAttribute('title', slide.dataset.titulo || '');
  if (i === 0) {
    ind.classList.add('activo');
    ind.setAttribute('aria-current', 'true');
  }
  ind.addEventListener('click', () => irADiapositiva(i));
  indicadoresContainer.appendChild(ind);

  const footerNum = slide.querySelector('.footer-numero');
  if (footerNum) footerNum.textContent = `${i + 1} / ${totalSlides}`;
});

const indicadores = document.querySelectorAll('.indicador');

/* ═══════════════════════════════════════════
   NAVEGACIÓN DE DIAPOSITIVAS
   ═══════════════════════════════════════════ */
function actualizar() {
  diapositivas.forEach((d, i) => {
    const esActual = i === actual;
    d.classList.toggle('activa', esActual);
    d.setAttribute('aria-hidden', esActual ? 'false' : 'true');

    if (esActual) {
      const tema = d.dataset.theme || 'metatron';
      document.body.setAttribute('data-slide-theme', tema);
    }
  });

  indicadores.forEach((ind, i) => {
    const esActual = i === actual;
    ind.classList.toggle('activo', esActual);
    ind.setAttribute('aria-current', esActual ? 'true' : 'false');
  });

  if (barra) {
    barra.style.width = `${((actual + 1) / totalSlides) * 100}%`;
  }

  if (slideCounter) {
    slideCounter.textContent = `${actual + 1} / ${totalSlides}`;
  }

  if (tituloHud) {
    tituloHud.textContent = diapositivas[actual]?.dataset.titulo || '';
  }

  const btnAnt = document.getElementById('btnAnterior');
  const btnSig = document.getElementById('btnSiguiente');
  if (btnAnt) btnAnt.disabled = (actual === 0);
  if (btnSig) btnSig.disabled = (actual === totalSlides - 1);
}

function cambiarDiapositiva(dir) {
  const nuevo = actual + dir;
  if (nuevo >= 0 && nuevo < totalSlides) {
    direccion = dir;
    actual    = nuevo;
    actualizar();
  }
}

function irADiapositiva(i) {
  if (i === actual) return;
  direccion = i > actual ? 1 : -1;
  actual    = i;
  actualizar();
}

window.cambiarDiapositiva = cambiarDiapositiva;
window.irADiapositiva     = irADiapositiva;

/* ═══════════════════════════════════════════
   DEMOSTRACIÓN INTERACTIVA EN VIVO (SLIDE 3)
   ═══════════════════════════════════════════ */
function cambiarModoDemo(btn, modo) {
  document.querySelectorAll('.btn-demo-mode').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const grid = document.getElementById('freecode-display-grid');
  const status = document.getElementById('demo-status-text');
  if (!grid) return;

  grid.classList.remove('mode-flex', 'mode-grid-inspector', 'mode-cyberpunk');

  if (modo === 'normal') {
    if (status) status.textContent = 'Vista estándar: CSS Grid 2x2 equilibrado';
  } else if (modo === 'flex') {
    grid.classList.add('mode-flex');
    if (status) status.textContent = 'Demostrando: Flexbox adaptativo en línea con CSS puro';
  } else if (modo === 'grid') {
    grid.classList.add('mode-grid-inspector');
    if (status) status.textContent = 'Demostrando: Inspector CSS Grid 3D con coordenadas visuales';
  } else if (modo === 'cyberpunk') {
    grid.classList.add('mode-cyberpunk');
    if (status) status.textContent = 'Demostrando: Tema Cyberpunk con glow neon y contrastes altos';
  }
}
window.cambiarModoDemo = cambiarModoDemo;

/* ═══════════════════════════════════════════
   SLIDE 4 — SIMULADOR MOBILE-FIRST & MODO WCAG AAA
   ═══════════════════════════════════════════ */
function toggleSimuladorMobileFirst() {
  const sim = document.getElementById('simulador-mobile-first');
  if (!sim) return;
  const isVisible = sim.classList.contains('active');
  if (isVisible) {
    cerrarSimulador();
  } else {
    sim.classList.add('active');
    ajustarSimulador('mobile');
  }
}

function cerrarSimulador() {
  const sim = document.getElementById('simulador-mobile-first');
  if (sim) sim.classList.remove('active');
}

function ajustarSimulador(dispositivo) {
  const mockWeb = document.querySelector('.mock-website');
  const label   = document.getElementById('sim-viewport-label');
  const buttons = document.querySelectorAll('.btn-sim');

  buttons.forEach(b => b.classList.remove('active'));

  if (!mockWeb) return;
  mockWeb.classList.remove('view-mobile', 'view-tablet', 'view-desktop');

  if (dispositivo === 'mobile') {
    mockWeb.classList.add('view-mobile');
    if (label) label.textContent = '📱 Vista Mobile: 375px (Mobile-First — base del diseño)';
    buttons[0]?.classList.add('active');
  } else if (dispositivo === 'tablet') {
    mockWeb.classList.add('view-tablet');
    if (label) label.textContent = '📟 Vista Tablet: 600px (@media min-width: 600px)';
    buttons[1]?.classList.add('active');
  } else if (dispositivo === 'desktop') {
    mockWeb.classList.add('view-desktop');
    if (label) label.textContent = '💻 Vista Desktop: 100% (@media min-width: 1024px)';
    buttons[2]?.classList.add('active');
  }
}

function toggleAccesibilidadModo(btn) {
  const isHighContrast = document.body.classList.toggle('high-contrast-mode');
  const pill = btn.querySelector('.a11y-pill');
  if (pill) {
    pill.textContent = isHighContrast ? '✓ WCAG AAA Activo' : 'WCAG AAA ⚡';
  }
}

window.toggleSimuladorMobileFirst = toggleSimuladorMobileFirst;
window.cerrarSimulador            = cerrarSimulador;
window.ajustarSimulador           = ajustarSimulador;
window.toggleAccesibilidadModo    = toggleAccesibilidadModo;

function activarEfectoEje(tipo) {
  const certImg = document.getElementById('cert-img-element');
  if (!certImg) return;

  if (tipo === 'responsive') {
    certImg.style.transform = 'perspective(1200px) rotateY(-8deg) scale(0.96)';
  } else if (tipo === 'semantica') {
    certImg.style.transform = 'perspective(1200px) rotateX(6deg) scale(1.05)';
  } else if (tipo === 'css3') {
    certImg.style.filter = 'hue-rotate(90deg) drop-shadow(0 0 35px #00C8FF)';
  }
}

function desactivarEfectoEje() {
  const certImg = document.getElementById('cert-img-element');
  if (!certImg) return;
  certImg.style.transform  = '';
  certImg.style.filter     = '';
}
window.activarEfectoEje    = activarEfectoEje;
window.desactivarEfectoEje = desactivarEfectoEje;

/* ═══════════════════════════════════════════
   CARRUSELES LOOP CONTINUOS (SLIDES 5 Y 7)
   ═══════════════════════════════════════════ */
function moverCarrusel(trackId, dir) {
  const track = document.getElementById(trackId);
  const wrapper = track?.parentElement;
  if (!wrapper) return;
  wrapper.scrollBy({ left: dir * 300, behavior: 'smooth' });
}

function pausarCarrusel(trackId) {
  const track = document.getElementById(trackId);
  if (track) track.classList.add('paused');
}

function reanudarCarrusel(trackId) {
  const track = document.getElementById(trackId);
  if (track) track.classList.remove('paused');
}

window.moverCarrusel    = moverCarrusel;
window.pausarCarrusel   = pausarCarrusel;
window.reanudarCarrusel = reanudarCarrusel;

/* ═══════════════════════════════════════════
   ILUMINACIÓN DE COMPONENTES VUE/ASTRO (SLIDE 6)
   ═══════════════════════════════════════════ */
function iluminarComponente(el) {
  document.querySelectorAll('.habitacion-chip').forEach(c => c.classList.remove('active-chip'));
  el.classList.add('active-chip');
}
window.iluminarComponente = iluminarComponente;

let chipIndex = 1;
setInterval(() => {
  const slide6 = document.querySelector('.diapositiva[data-titulo*="Framework"]');
  if (slide6 && slide6.classList.contains('activa')) {
    chipIndex = (chipIndex % 4) + 1;
    const targetChip = document.getElementById(`chip-${chipIndex}`);
    if (targetChip) {
      document.querySelectorAll('.habitacion-chip').forEach(c => c.classList.remove('active-chip'));
      targetChip.classList.add('active-chip');
    }
  }
}, 3000);

/* ═══════════════════════════════════════════
   3D COVERFLOW SHOWCASE (SLIDE 7)
   ═══════════════════════════════════════════ */
let coverflowIndex = 0;
const totalCoverflow = 8;

function updateCoverflow() {
  const items = document.querySelectorAll('.coverflow-item');
  const indicator = document.getElementById('coverflow-indicator');

  if (indicator) {
    indicator.textContent = `${coverflowIndex + 1} / ${totalCoverflow}`;
  }

  items.forEach((item, i) => {
    item.className = 'coverflow-item';
    const diff = i - coverflowIndex;

    if (diff === 0) {
      item.classList.add('active');
    } else if (diff === 1) {
      item.classList.add('next-1');
    } else if (diff === -1) {
      item.classList.add('prev-1');
    } else if (diff === 2) {
      item.classList.add('next-2');
    } else if (diff === -2) {
      item.classList.add('prev-2');
    } else if (diff < -2) {
      item.classList.add('hidden-left');
    } else if (diff > 2) {
      item.classList.add('hidden-right');
    }
  });
}

function moverCoverflow(dir) {
  coverflowIndex = (coverflowIndex + dir + totalCoverflow) % totalCoverflow;
  updateCoverflow();
}

function seleccionarCoverflow(idx) {
  if (idx === coverflowIndex) {
    const item = document.querySelectorAll('.coverflow-item')[idx];
    const img = item?.querySelector('img');
    if (img) abrirLightbox(img.src);
  } else {
    coverflowIndex = idx;
    updateCoverflow();
  }
}

window.moverCoverflow       = moverCoverflow;
window.seleccionarCoverflow = seleccionarCoverflow;

/* ═══════════════════════════════════════════
   LIGHTBOX
   ═══════════════════════════════════════════ */
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const btnCerrar   = document.getElementById('lightbox-cerrar');

function abrirLightbox(src) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightbox.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function cerrarLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove('visible');
  setTimeout(() => { lightboxImg.src = ''; }, 350);
}

if (lightbox) lightbox.addEventListener('click', cerrarLightbox);
if (lightboxImg) lightboxImg.addEventListener('click', e => e.stopPropagation());
if (btnCerrar) btnCerrar.addEventListener('click', cerrarLightbox);

window.abrirLightbox  = abrirLightbox;
window.cerrarLightbox = cerrarLightbox;

/* ═══════════════════════════════════════════
   TECLADO
   ═══════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
  if (lightbox && lightbox.classList.contains('visible')) {
    if (e.key === 'Escape') cerrarLightbox();
    return;
  }
  if (hoverModal && hoverModal.classList.contains('active')) {
    if (e.key === 'Escape') desactivarHoverFullscreen();
    return;
  }

  // Atajos para Coverflow en Slide 7
  if (actual === 6) {
    if (e.key === 'j' || e.key === 'J') { moverCoverflow(-1); return; }
    if (e.key === 'k' || e.key === 'K') { moverCoverflow(1); return; }
  }

  switch (e.key) {
    case 'ArrowRight':
    case 'PageDown':
    case ' ':
      e.preventDefault();
      cambiarDiapositiva(1);
      break;

    case 'ArrowLeft':
    case 'PageUp':
      e.preventDefault();
      cambiarDiapositiva(-1);
      break;

    case 'Escape':
      cerrarLightbox();
      cerrarSimulador();
      desactivarHoverFullscreen();
      break;

    case 't':
    case 'T':
      toggleTimer();
      break;

    case 'Home':
      e.preventDefault();
      irADiapositiva(0);
      break;

    case 'End':
      e.preventDefault();
      irADiapositiva(totalSlides - 1);
      break;
  }
});

/* ═══════════════════════════════════════════
   TOUCH / SWIPE
   ═══════════════════════════════════════════ */
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', e => {
  const dx = touchStartX - e.changedTouches[0].screenX;
  const dy = touchStartY - e.changedTouches[0].screenY;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    cambiarDiapositiva(dx > 0 ? 1 : -1);
  }
}, { passive: true });

/* ═══════════════════════════════════════════
   TIMER PARA EL EXPOSITOR (tecla T)
   ═══════════════════════════════════════════ */
const timerContainer = document.getElementById('timer-container');
const timerDisplay   = document.getElementById('timer-display');

let timerInterval = null;
let timerSegundos = 0;
let timerActivo   = false;

function toggleTimer() {
  if (!timerActivo) {
    timerActivo = true;
    timerContainer?.classList.add('visible');
    timerInterval = setInterval(() => {
      timerSegundos++;
      const m = Math.floor(timerSegundos / 60).toString().padStart(2, '0');
      const s = (timerSegundos % 60).toString().padStart(2, '0');
      if (timerDisplay) {
        timerDisplay.textContent = `${m}:${s}`;
        if (timerSegundos >= 1080) timerDisplay.style.color = '#E6B800';
        if (timerSegundos >= 1200) timerDisplay.style.color = '#FF4757';
      }
    }, 1000);
  } else {
    clearInterval(timerInterval);
    timerActivo   = false;
    timerSegundos = 0;
    timerContainer?.classList.remove('visible');
    if (timerDisplay) {
      timerDisplay.textContent  = '00:00';
      timerDisplay.style.color  = '';
    }
  }
}

/* ═══════════════════════════════════════════
   INICIALIZACIÓN
   ═══════════════════════════════════════════ */
setupCursorHovers();
updateCoverflow();
actualizar();
