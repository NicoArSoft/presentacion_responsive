/**
 * presentacion.js — PROTEC Dante Nicolás Martínez
 * "Aprender, construir y enseñar"
 * JavaScript Vanilla Senior — Alto rendimiento, 60fps rAF, 100% Offline
 */

/* ═══════════════════════════════════════════
   ESTADO GLOBAL Y SELECTORES
   ═══════════════════════════════════════════ */
let actual    = 0;
let direccion = 1;

const diapositivas         = document.querySelectorAll('.diapositiva');
const indicadoresContainer = document.getElementById('indicadores');
const barra                = document.getElementById('progreso');
const slideCounter         = document.getElementById('slide-counter');
const tituloHud            = document.getElementById('titulo-actual');
const totalSlides          = diapositivas.length;

// Elementos de Cursor Dinámico
const cursorDot   = document.getElementById('cursor-dot');
const cursorRing  = document.getElementById('cursor-ring');
const cursorBadge = document.getElementById('cursor-badge');

/* ═══════════════════════════════════════════
   SISTEMA DE PARTÍCULAS / CHISPAS SUTILES DE RATÓN (SLIDES 2 A 8)
   ═══════════════════════════════════════════ */
const canvasParticles = document.getElementById('mouse-particles-canvas');
let ctxParticles = null;
let chispas = [];

if (canvasParticles) {
  ctxParticles = canvasParticles.getContext('2d');
  ajustarDimensionesCanvas();
  window.addEventListener('resize', ajustarDimensionesCanvas);
}

function ajustarDimensionesCanvas() {
  if (!canvasParticles) return;
  canvasParticles.width  = window.innerWidth;
  canvasParticles.height = window.innerHeight;
}

class Chispa {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angulo = Math.random() * Math.PI * 2;
    const velocidad = Math.random() * 1.8 + 0.4;
    this.vx = Math.cos(angulo) * velocidad;
    this.vy = Math.sin(angulo) * velocidad - 0.4; // leve ascenso
    this.tamano = Math.random() * 2.8 + 1.2;
    this.vida = 1.0;
    this.decae = Math.random() * 0.025 + 0.015;

    // Paleta sutil: dorada, eléctrica y plata
    const colores = ['#E6B800', '#00C8FF', '#FFD700', '#E2E8F0', '#41B883'];
    this.color = colores[Math.floor(Math.random() * colores.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vida -= this.decae;
    this.tamano *= 0.96;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(this.vida, 0);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 6;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(this.tamano, 0.5), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function animarChispas() {
  if (!ctxParticles) return;
  ctxParticles.clearRect(0, 0, canvasParticles.width, canvasParticles.height);

  for (let i = chispas.length - 1; i >= 0; i--) {
    chispas[i].update();
    if (chispas[i].vida <= 0 || chispas[i].tamano <= 0.4) {
      chispas.splice(i, 1);
    } else {
      chispas[i].draw(ctxParticles);
    }
  }

  requestAnimationFrame(animarChispas);
}
requestAnimationFrame(animarChispas);

/* ═══════════════════════════════════════════
   PUNTERO DINÁMICO (LERP INTERPOLADO)
   ═══════════════════════════════════════════ */
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX  = mouseX;
let ringY  = mouseY;
let isCursorMoving = false;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Generar chispas solo en Slides 2 a 8 (Slide 1 tiene cursor estándar)
  if (actual > 0 && Math.random() > 0.45) {
    chispas.push(new Chispa(mouseX, mouseY));
    if (chispas.length > 45) chispas.shift();
  }

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
      if (actual > 0) document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });
}

/* ═══════════════════════════════════════════
   SLIDE 2 — LÍNEA DE TIEMPO CON COOLDOWN DE 2s
   ═══════════════════════════════════════════ */
const hoverModal = document.getElementById('hover-fullscreen-overlay');
let slide2CooldownTimer = null;

function manejarHoverImagenSlide2(isEnter) {
  if (isEnter) {
    if (slide2CooldownTimer) {
      clearTimeout(slide2CooldownTimer);
      slide2CooldownTimer = null;
    }
    activarHoverFullscreen();
  } else {
    // Al salir, esperar cooldown de 2 segundos antes de volver
    if (slide2CooldownTimer) clearTimeout(slide2CooldownTimer);
    slide2CooldownTimer = setTimeout(() => {
      desactivarHoverFullscreen();
      slide2CooldownTimer = null;
    }, 2000);
  }
}

function activarHoverFullscreen() {
  if (hoverModal) hoverModal.classList.add('active');
}

function desactivarHoverFullscreen() {
  if (hoverModal) hoverModal.classList.remove('active');
}

if (hoverModal) {
  hoverModal.addEventListener('click', desactivarHoverFullscreen);
}

window.manejarHoverImagenSlide2  = manejarHoverImagenSlide2;
window.activarHoverFullscreen    = activarHoverFullscreen;
window.desactivarHoverFullscreen = desactivarHoverFullscreen;

/* ═══════════════════════════════════════════
   SLIDE 2 — ENCENDIDO INTERACTIVO Y SECUENCIAL DE ETAPAS (1..4 / J, K / RESET)
   ═══════════════════════════════════════════ */
let etapasReveladasSlide2 = 0; // Cantidad de etapas visibles descubiertas (0 a 4)
let etapaFocoSlide2 = -1;       // Cuál tiene el foco/efecto CSS3 activo (0 a 3)

function revelarHastaEtapa(numeroEtapa) {
  const items = document.querySelectorAll('#ciclo-lista-etapas .ciclo-item');
  if (!items || !items.length) return;
  if (numeroEtapa < 1 || numeroEtapa > items.length) return;

  // Revela hasta la etapa indicada (si no estaba descubierta)
  etapasReveladasSlide2 = Math.max(etapasReveladasSlide2, numeroEtapa);
  etapaFocoSlide2 = numeroEtapa - 1;

  items.forEach((item, i) => {
    const etapaNum = i + 1;
    const esRevelada = etapaNum <= etapasReveladasSlide2;
    const esFoco = i === etapaFocoSlide2;

    item.classList.toggle('revelado', esRevelada);

    if (esFoco) {
      item.classList.remove('encendido');
      void item.offsetWidth; // Reflow para reiniciar la animación CSS3 al activarse
      item.classList.add('encendido');
      item.setAttribute('aria-selected', 'true');
    } else {
      item.classList.remove('encendido');
      item.setAttribute('aria-selected', 'false');
    }
  });

  actualizarIndicadorCiclo();
}

function avanzarEtapaCiclo() {
  const items = document.querySelectorAll('#ciclo-lista-etapas .ciclo-item');
  if (!items || !items.length) return;

  if (etapasReveladasSlide2 < items.length) {
    revelarHastaEtapa(etapasReveladasSlide2 + 1);
  } else {
    // Si ya están las 4 reveladas, alterna el foco a la siguiente circularmente
    let nuevoFoco = (etapaFocoSlide2 + 1) % items.length;
    revelarHastaEtapa(nuevoFoco + 1);
  }
}

function retrocederEtapaCiclo() {
  const items = document.querySelectorAll('#ciclo-lista-etapas .ciclo-item');
  if (!items || !items.length) return;

  if (etapasReveladasSlide2 > 0) {
    etapasReveladasSlide2--;
    etapaFocoSlide2 = etapasReveladasSlide2 > 0 ? etapasReveladasSlide2 - 1 : -1;

    items.forEach((item, i) => {
      const etapaNum = i + 1;
      const esRevelada = etapaNum <= etapasReveladasSlide2;
      const esFoco = i === etapaFocoSlide2;

      item.classList.toggle('revelado', esRevelada);
      item.classList.toggle('encendido', esFoco);
      item.setAttribute('aria-selected', esFoco ? 'true' : 'false');
    });

    actualizarIndicadorCiclo();
  }
}

function resetearCiclo() {
  etapasReveladasSlide2 = 0;
  etapaFocoSlide2 = -1;
  const items = document.querySelectorAll('#ciclo-lista-etapas .ciclo-item');
  if (items) {
    items.forEach(item => {
      item.classList.remove('revelado', 'encendido');
      item.setAttribute('aria-selected', 'false');
    });
  }
  actualizarIndicadorCiclo();
}

function actualizarIndicadorCiclo() {
  const hintTxt = document.getElementById('ciclo-hint-dinamico');
  const btnReset = document.getElementById('btn-reset-ciclo');

  if (btnReset) {
    btnReset.style.display = etapasReveladasSlide2 > 0 ? 'inline-flex' : 'none';
  }

  if (hintTxt) {
    if (etapasReveladasSlide2 === 0) {
      hintTxt.innerHTML = 'Pulsa <kbd class="ciclo-kbd" onclick="revelarHastaEtapa(1)">1</kbd> o <kbd class="ciclo-kbd" onclick="avanzarEtapaCiclo()">J</kbd> para encender la 1.ª etapa';
    } else if (etapasReveladasSlide2 < 4) {
      hintTxt.innerHTML = `Etapa ${etapasReveladasSlide2}/4 encendida · Pulsa <kbd class="ciclo-kbd" onclick="revelarHastaEtapa(${etapasReveladasSlide2 + 1})">${etapasReveladasSlide2 + 1}</kbd> o <kbd class="ciclo-kbd" onclick="avanzarEtapaCiclo()">J</kbd> para la siguiente`;
    } else {
      hintTxt.innerHTML = '✓ 4 etapas completadas · Pulsa <kbd class="ciclo-kbd" onclick="revelarHastaEtapa(1)">1</kbd>-<kbd class="ciclo-kbd" onclick="revelarHastaEtapa(4)">4</kbd> para enfocar';
    }
  }
}

window.revelarHastaEtapa    = revelarHastaEtapa;
window.avanzarEtapaCiclo    = avanzarEtapaCiclo;
window.retrocederEtapaCiclo = retrocederEtapaCiclo;
window.resetearCiclo        = resetearCiclo;

/* ═══════════════════════════════════════════
   SLIDE 3 — SPOTLIGHT CON COOLDOWN DE 2s
   ═══════════════════════════════════════════ */
let cardCooldownTimers = new Map();

function iniciarSpotlightCard(card) {
  const timer = cardCooldownTimers.get(card);
  if (timer) {
    clearTimeout(timer);
    cardCooldownTimers.delete(card);
  }
  card.classList.add('spotlight-active');
}

function finalizarSpotlightCard(card) {
  // Se cierra inmediatamente cuando se deja de señalar (sin cooldown)
  card.classList.remove('spotlight-active');
  const timer = cardCooldownTimers.get(card);
  if (timer) {
    clearTimeout(timer);
    cardCooldownTimers.delete(card);
  }
}

window.iniciarSpotlightCard   = iniciarSpotlightCard;
window.finalizarSpotlightCard = finalizarSpotlightCard;

/* ═══════════════════════════════════════════
   SLIDE 4 — CERTIFICADO & INTERACTIVIDAD
   ═══════════════════════════════════════════ */
let certCooldownTimer = null;

function manejarHoverCertificado(isEnter) {
  const certImg = document.getElementById('cert-img-element');
  if (!certImg) return;

  if (isEnter) {
    if (certCooldownTimer) {
      clearTimeout(certCooldownTimer);
      certCooldownTimer = null;
    }
    certImg.style.transform = 'perspective(1200px) rotateY(4deg) scale(1.1)';
  } else {
    if (certCooldownTimer) clearTimeout(certCooldownTimer);
    certCooldownTimer = setTimeout(() => {
      certImg.style.transform = '';
      certCooldownTimer = null;
    }, 2000);
  }
}
window.manejarHoverCertificado = manejarHoverCertificado;

// Modal Infografía Semántica
const modalSemantica = document.getElementById('modal-semantica');

function abrirModalSemantica() {
  if (modalSemantica) modalSemantica.classList.add('active');
}
function cerrarModalSemantica() {
  if (modalSemantica) modalSemantica.classList.remove('active');
}
if (modalSemantica) {
  modalSemantica.addEventListener('click', (e) => {
    if (e.target === modalSemantica) cerrarModalSemantica();
  });
}
window.abrirModalSemantica  = abrirModalSemantica;
window.cerrarModalSemantica = cerrarModalSemantica;

// Demostración en vivo: "¿Y si no hubiera CSS3?" — Visor HTML Puro Crudo
const modalHtmlPuro = document.getElementById('modal-html-puro');

function toggleDemostrarSinCSS() {
  if (modalHtmlPuro) {
    modalHtmlPuro.classList.add('active');
  }
}

function cerrarDemoSinCSS() {
  if (modalHtmlPuro) {
    modalHtmlPuro.classList.remove('active');
  }
}

if (modalHtmlPuro) {
  modalHtmlPuro.addEventListener('click', (e) => {
    if (e.target === modalHtmlPuro) cerrarDemoSinCSS();
  });
}

window.toggleDemostrarSinCSS = toggleDemostrarSinCSS;
window.cerrarDemoSinCSS       = cerrarDemoSinCSS;

// Simulador Mobile First
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
   SLIDE 8 — MODAL EMOTIVO DE CIERRE 🙏
   ═══════════════════════════════════════════ */
const modalCierre = document.getElementById('modal-cierre-emotivo');

function abrirModalCierreEmotivo() {
  if (modalCierre) modalCierre.classList.add('active');

  // Lanzar ráfaga de chispas festivas al abrir
  for (let i = 0; i < 40; i++) {
    const rx = window.innerWidth / 2 + (Math.random() * 200 - 100);
    const ry = window.innerHeight / 2 + (Math.random() * 200 - 100);
    chispas.push(new Chispa(rx, ry));
  }
}

function cerrarModalCierreEmotivo() {
  if (modalCierre) modalCierre.classList.remove('active');
  // Colapsar paneles QR al cerrar para mantener el modal limpio
  document.querySelectorAll('.qr-panel-item').forEach(p => {
    p.classList.remove('visible');
    p.setAttribute('aria-hidden', 'true');
  });
  document.querySelectorAll('.btn-qr-trigger').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-expanded', 'false');
  });
}

function toggleQR(panelId) {
  const panel = document.getElementById(panelId);
  const btn = document.querySelector(`.btn-qr-trigger[data-target="${panelId}"]`);
  if (!panel) return;

  const isVisible = panel.classList.contains('visible');
  if (isVisible) {
    panel.classList.remove('visible');
    panel.setAttribute('aria-hidden', 'true');
    if (btn) {
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
    }
  } else {
    panel.classList.add('visible');
    panel.setAttribute('aria-hidden', 'false');
    if (btn) {
      btn.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
  }
}

if (modalCierre) {
  modalCierre.addEventListener('click', (e) => {
    if (e.target === modalCierre) cerrarModalCierreEmotivo();
  });
}

window.abrirModalCierreEmotivo  = abrirModalCierreEmotivo;
window.cerrarModalCierreEmotivo = cerrarModalCierreEmotivo;
window.toggleQR                 = toggleQR;

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
   SLIDE 5 — MATRIX RAIN ENGINE (CANVAS)
   Palabras clave: PROTEC, NICO CODE, FreeCodeCamp
   ═══════════════════════════════════════════ */
const matrixCanvas = document.getElementById('matrix-rain-canvas');
let matrixCtx = null;
let matrixAnimationId = null;
let matrixColumns = [];
const matrixKeywords = ['PROTEC', 'NICO CODE', 'FreeCodeCamp', '<div>', 'const', 'return', 'Vue', 'flex', 'grid', '0', '1', '()=>{}'];

function ajustarDimensionesMatrix() {
  if (!matrixCanvas) return;
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
  const colCount = Math.floor(matrixCanvas.width / 24);
  matrixColumns = Array.from({ length: colCount }, () => ({
    y: Math.random() * -100,
    speed: Math.random() * 1.5 + 1.1,
    wordIdx: Math.floor(Math.random() * matrixKeywords.length),
    charIdx: 0
  }));
}

if (matrixCanvas) {
  matrixCtx = matrixCanvas.getContext('2d');
  ajustarDimensionesMatrix();
  window.addEventListener('resize', ajustarDimensionesMatrix);
}

function animarMatrixRain() {
  if (!matrixCtx || !matrixCanvas) return;

  matrixCtx.fillStyle = 'rgba(5, 10, 20, 0.16)';
  matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

  matrixCtx.font = '13px monospace';

  for (let i = 0; i < matrixColumns.length; i++) {
    const col = matrixColumns[i];
    const word = matrixKeywords[col.wordIdx];
    const char = word[col.charIdx % word.length];

    const x = i * 24;
    const y = col.y;

    if (Math.random() > 0.88) {
      matrixCtx.fillStyle = '#FFFFFF';
      matrixCtx.shadowColor = '#00FF66';
      matrixCtx.shadowBlur = 8;
    } else if (word === 'PROTEC' || word === 'NICO CODE' || word === 'FreeCodeCamp') {
      matrixCtx.fillStyle = '#00FF88';
      matrixCtx.shadowColor = '#00FF88';
      matrixCtx.shadowBlur = 6;
    } else {
      matrixCtx.fillStyle = 'rgba(0, 200, 120, 0.75)';
      matrixCtx.shadowBlur = 0;
    }

    matrixCtx.fillText(char, x, y);

    col.y += 18 * col.speed;
    col.charIdx++;

    if (col.y > matrixCanvas.height + 60 && Math.random() > 0.96) {
      col.y = -20;
      col.speed = Math.random() * 1.5 + 1.1;
      col.wordIdx = Math.floor(Math.random() * matrixKeywords.length);
      col.charIdx = 0;
    }
  }

  matrixAnimationId = requestAnimationFrame(animarMatrixRain);
}

function iniciarMatrixRain() {
  if (!matrixCanvas || matrixAnimationId) return;
  ajustarDimensionesMatrix();
  matrixAnimationId = requestAnimationFrame(animarMatrixRain);
}

function detenerMatrixRain() {
  if (matrixAnimationId) {
    cancelAnimationFrame(matrixAnimationId);
    matrixAnimationId = null;
  }
}

/* ═══════════════════════════════════════════
   ILUMINACIÓN Y ACCIÓN REACTIVA DE COMPONENTES VUE/ASTRO (SLIDE 6)
   ═══════════════════════════════════════════ */
const compFeedbackTxt  = document.getElementById('comp-feedback-txt');
const compFeedbackIcon = document.getElementById('comp-feedback-icon');

function iluminarComponente(el) {
  document.querySelectorAll('.habitacion-chip').forEach(c => c.classList.remove('active-chip'));
  if (el) el.classList.add('active-chip');
}

function ejecutarAccionComponente(tipo, el) {
  iluminarComponente(el);

  if (tipo === 'theme' || tipo === 'toggle') {
    const slide6 = el?.closest('.diapositiva') || document.querySelector('.diapositiva[data-theme="framework"]') || diapositivas[5];
    if (slide6) {
      const isLight = slide6.classList.toggle('slide6-tema-claro');
      
      // Actualización visual reactiva del propio chip <ThemeToggle />
      const chipTheme = document.getElementById('chip-4') || el;
      if (chipTheme) {
        const emoji = chipTheme.querySelector('.hab-emoji');
        const desc = chipTheme.querySelector('.hab-desc');
        if (emoji) emoji.textContent = isLight ? '☀️' : '🌙';
        if (desc) desc.textContent = isLight ? 'Estado global de tema claro' : 'Estado global de tema oscuro';
        chipTheme.title = isLight ? 'Clic para volver al tema Oscuro' : 'Clic para alternar a tema Claro';
      }

      if (compFeedbackTxt) {
        compFeedbackTxt.textContent = isLight
          ? '☀️ <ThemeToggle />: Modo Claro Activado — Estilos adaptables y contraste diurno.'
          : '🌙 <ThemeToggle />: Modo Oscuro Restaurado — Paleta nocturna con degradados Metatrón.';
      }
      if (compFeedbackIcon) {
        compFeedbackIcon.textContent = isLight ? '☀️' : '🌙';
      }
    }
  } else {
    const acciones = {
      navbar: {
        icon: '🧭',
        txt: '⚡ <TheNavbar />: Emite evento reactivo "@navigate" y monta rutas dinámicas en el Virtual DOM.'
      },
      projects: {
        icon: '🎨',
        txt: '⚡ <ProjectsGrid />: Renderiza 8 tarjetas reactivas vía v-for iterando un array desacoplado.'
      },
      grid: {
        icon: '🎨',
        txt: '⚡ <ProjectsGrid />: Renderiza 8 tarjetas reactivas vía v-for iterando un array desacoplado.'
      },
      form: {
        icon: '✉️',
        txt: '⚡ <ContactForm />: Aplica Two-Way Data Binding con v-model y validación en tiempo real.'
      }
    };

    const accion = acciones[tipo];
    if (accion && compFeedbackTxt) {
      compFeedbackTxt.textContent = accion.txt;
      if (compFeedbackIcon) compFeedbackIcon.textContent = accion.icon;
    }
  }

  const panel = document.getElementById('comp-feedback-panel');
  if (panel) {
    panel.style.transform = 'scale(1.02)';
    setTimeout(() => { panel.style.transform = ''; }, 250);
  }

  if (el) {
    const rect = el.getBoundingClientRect();
    for (let i = 0; i < 15; i++) {
      chispas.push(new Chispa(rect.left + rect.width / 2, rect.top + rect.height / 2));
    }
  }
}

window.iluminarComponente        = iluminarComponente;
window.ejecutarAccionComponente = ejecutarAccionComponente;

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
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const btnCerrar       = document.getElementById('lightbox-cerrar');

function abrirLightbox(src, caption = '') {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  if (lightboxCaption) {
    if (caption) {
      lightboxCaption.textContent = caption;
      lightboxCaption.style.display = 'block';
    } else {
      lightboxCaption.textContent = '';
      lightboxCaption.style.display = 'none';
    }
  }
  lightbox.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function cerrarLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove('visible');
  setTimeout(() => {
    lightboxImg.src = '';
    if (lightboxCaption) {
      lightboxCaption.textContent = '';
      lightboxCaption.style.display = 'none';
    }
  }, 350);
}

if (lightbox) lightbox.addEventListener('click', cerrarLightbox);
if (lightboxImg) lightboxImg.addEventListener('click', e => e.stopPropagation());
if (lightboxCaption) lightboxCaption.addEventListener('click', e => e.stopPropagation());
if (btnCerrar) btnCerrar.addEventListener('click', cerrarLightbox);

window.abrirLightbox  = abrirLightbox;
window.cerrarLightbox = cerrarLightbox;

/* ═══════════════════════════════════════════
   PORTAFOLIO BÁSICO (ENLACE NETLIFY & FALLBACK CAPTURA)
   ═══════════════════════════════════════════ */
const URL_PORTAFOLIO_BASICO = 'https://tutorial-portafolio-vuejs.netlify.app/';
const CAPTURA_PORTAFOLIO_BASICO = 'imagenes/portafolio_basico_demo.webp';

function ingresarPortafolioBasico(event) {
  // Si el navegador está sin conexión (offline)
  if (!navigator.onLine) {
    if (event) event.preventDefault();
    mostrarToastPortafolio('⚠️ Sin conexión a internet detectada. Mostrando captura de respaldo del portafolio...', true);
    abrirLightbox(CAPTURA_PORTAFOLIO_BASICO, 'Captura de Respaldo — Portafolio Básico (Sin conexión a Internet)');
    return false;
  }

  // Si está online, hacemos una verificación preventiva rápida con timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2200);

  fetch(URL_PORTAFOLIO_BASICO, {
    method: 'HEAD',
    mode: 'no-cors',
    cache: 'no-store',
    signal: controller.signal
  })
    .catch(() => {
      // Si la petición falla (bloqueo de red institucional, Netlify caído, etc.)
      mostrarToastPortafolio('⚠️ ¿Problemas para cargar Netlify? Haz clic aquí para ver la captura de respaldo.', true);
    })
    .finally(() => {
      clearTimeout(timeoutId);
    });

  return true;
}

function mostrarToastPortafolio(mensaje, conAccion = false) {
  let toast = document.getElementById('toast-portafolio-fallback');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-portafolio-fallback';
    toast.className = 'toast-portafolio-alerta';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span>${mensaje}</span>
    ${conAccion ? `<button type="button" class="btn-toast-ver-captura" onclick="abrirLightbox('${CAPTURA_PORTAFOLIO_BASICO}', 'Captura de Respaldo — Portafolio Básico');">Ver Captura</button>` : ''}
    <button type="button" class="btn-toast-cerrar" onclick="this.parentElement.classList.remove('visible')">✕</button>
  `;

  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 7000);
}

window.ingresarPortafolioBasico = ingresarPortafolioBasico;
window.mostrarToastPortafolio  = mostrarToastPortafolio;

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

  // Control de Matrix Rain (Slide 5: índice 4)
  if (actual === 4) {
    iniciarMatrixRain();
  } else {
    detenerMatrixRain();
  }

  // Limpiar selección de etapas en Slide 2 al salir de ella
  if (actual !== 1) {
    resetearCiclo();
  }
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
   TECLADO
   ═══════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
  if (modalHtmlPuro && modalHtmlPuro.classList.contains('active')) {
    if (e.key === 'Escape') cerrarDemoSinCSS();
    return;
  }
  if (modalCierre && modalCierre.classList.contains('active')) {
    if (e.key === 'Escape') cerrarModalCierreEmotivo();
    return;
  }
  if (modalSemantica && modalSemantica.classList.contains('active')) {
    if (e.key === 'Escape') cerrarModalSemantica();
    return;
  }
  if (lightbox && lightbox.classList.contains('visible')) {
    if (e.key === 'Escape') cerrarLightbox();
    return;
  }
  if (hoverModal && hoverModal.classList.contains('active')) {
    if (e.key === 'Escape') desactivarHoverFullscreen();
    return;
  }

  // Atajos para etapas del ciclo de aprendizaje en Slide 2 (índice 1: teclas 1..4, J/K, R, 0, Flechas)
  if (actual === 1) {
    if (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4') {
      e.preventDefault();
      revelarHastaEtapa(parseInt(e.key, 10));
      return;
    }
    if (e.key === 'j' || e.key === 'J' || e.key === 'ArrowDown') {
      e.preventDefault();
      avanzarEtapaCiclo();
      return;
    }
    if (e.key === 'k' || e.key === 'K' || e.key === 'ArrowUp') {
      e.preventDefault();
      retrocederEtapaCiclo();
      return;
    }
    if (e.key === 'r' || e.key === 'R' || e.key === '0' || e.key === 'Backspace') {
      e.preventDefault();
      resetearCiclo();
      return;
    }
  }

  // Atajos para interactividad en Slide 6 (Vue & Componentes)
  if (actual === 5) {
    if (e.key === 't' || e.key === 'T') {
      const chip4 = document.getElementById('chip-4');
      ejecutarAccionComponente('theme', chip4);
      return;
    }
    if (e.key === '1') {
      const chip1 = document.getElementById('chip-1');
      ejecutarAccionComponente('navbar', chip1);
      return;
    }
    if (e.key === '2') {
      const chip2 = document.getElementById('chip-2');
      ejecutarAccionComponente('projects', chip2);
      return;
    }
    if (e.key === '3') {
      const chip3 = document.getElementById('chip-3');
      ejecutarAccionComponente('form', chip3);
      return;
    }
    if (e.key === '4') {
      const chip4 = document.getElementById('chip-4');
      ejecutarAccionComponente('theme', chip4);
      return;
    }
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
      cerrarModalSemantica();
      cerrarModalCierreEmotivo();
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
