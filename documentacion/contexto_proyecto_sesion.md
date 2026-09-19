# Contexto y Memoria Técnica del Proyecto TFI — Presentación Responsive

**Fecha de Actualización:** 19 de Septiembre de 2026  
**Autor:** Dante Nicolás Martínez (Técnico Universitario en Programación UTN FRSR / Profesorado para la ETP Mendoza)  
**Espacio Curricular:** Actualización Científico-Tecnológica (192 hs) — Prof. Celeste Derra  
**Institución:** IPA Mendoza — ETP / UTN Facultad Regional San Rafael  

---

## 🎯 1. Objetivo y Fundamentación Pedagógica del TFI

El Trabajo Final Integrador (TFI) titulado **"Aprender, construir y enseñar"** documenta la experiencia de actualización tecnológica en **Desarrollo Web Responsive** (Certificación de 300 hs en freeCodeCamp) y su transposición didáctica hacia:
1. Alumnos de 1.° Año de la Tecnicatura Universitaria en Programación (UTN FRSR).
2. Estudiantes de escuelas técnicas (ETP) de Mendoza.
3. Comunidad educativa abierta mediante el canal de YouTube *"Nico Code"*.

### Ciclo de Aprendizaje en 4 Etapas:
1. **Comprender:** Fundamentos y estándares web internacionales (HTML5 semántico, CSS3 moderno, WCAG AAA).
2. **Construir:** Desarrollo de proyectos concretos y aplicaciones reales paso a paso.
3. **Resolver:** Enfrentar desafíos de accesibilidad, compatibilidad entre navegadores y diseño móvil (*Mobile-First*).
4. **Enseñar / Profesionalizar:** Transferencia pedagógica en el aula y en plataformas digitales públicas.

---

## 🏗️ 2. Arquitectura Tecnológica del Proyecto

- **Stack Técnico:** **HTML5 Semántico + CSS3 Puro + JavaScript Vanilla (ES6+)**.
  - **Sin frameworks pesados ni dependencias externas** para demostrar dominio total de las bases nativas de la web.
- **Diseño Visual & UX:**
  - Modo oscuro cinematográfico con paleta curada (`#05080e`, azul eléctrico `#00C8FF`, dorado `#E6B800`, verde Vue `#41B883`).
  - **Custom Cursor Dinámico (Lerp)** con temas reactivos por diapositiva.
  - Totalmente adaptativo (*Mobile-First*) y contrastes accesibles **WCAG AAA** (> 7:1).

---

## 📑 3. Estructura de las 8 Diapositivas

1. **Slide 1 — Portada**:
   - Título, datos institucionales UTN/IPA y fondo animado de Geometría Sagrada (*Metatrón*).
   - Panel de Idea Fuerza con malla de gradientes CSS en movimiento continuo (`cita-mesh`) y borde resplandeciente.
2. **Slide 2 — Trayectoria y Ciclo**:
   - Infografía de la línea de tiempo con **pantalla completa automática directa en hover** (`#hover-fullscreen-overlay`) y fondo de *Flor de la Vida / Sri Yantra* colorida.
3. **Slide 3 — ¿Por qué freeCodeCamp?**:
   - Cuatro ejes formativos con cajas de íconos alineadas y centradas con `flexbox`.
   - Barra de demostración en vivo con 4 modos: `↺ Normal`, `Flexbox Dinámico`, `CSS Grid Inspector 3D` y `⚡ Modo Cyberpunk`.
4. **Slide 4 — Certificación Oficial freeCodeCamp (300 hs)**:
   - Certificado protagonista con sello dorado `✓ 300 HORAS CERTIFICADAS`.
   - **Simulador Mobile-First interactivo**: marco desplegable para probar en tiempo real las vistas *Mobile (375px)*, *Tablet (600px)* y *Desktop (100%)*.
   - **Modo Accesibilidad WCAG AAA**: conmutador de alto contraste con fondo negro puro `#000000`, textos e indicadores `#FFFF00` y banner superior.
5. **Slide 5 — Del Curso al Aula: Portafolio Básico**:
   - Carrusel continuo en loop infinito a **todo el alto de la diapositiva** (`height: 290px`) con las producciones de los alumnos (`basico_1.png` a `basico_8.png`). Pausa en hover y clic para Lightbox.
6. **Slide 6 — Del HTML al Framework: Vue.js & Astro**:
   - Analogía arquitectónica (*Habitación única monolítica vs. Casa modular por componentes*).
   - Badges de ecosistema: `Vue 3`, `🚀 Astro`, `Vite` y `Netlify`.
   - Loop interactivo de iluminación automática y al clic entre componentes.
7. **Slide 7 — Portafolio Avanzado & Canal "Nico Code"**:
   - **Showcase 3D Coverflow**: tarjetas en abanico con perspectiva tridimensional, navegación `◀ / ▶`, selección interactiva y atajos `J / K`.
   - Tarjeta CTA del canal de YouTube con estadísticas de clases publicadas.
8. **Slide 8 — Reflexión Docente y Cierre**:
   - 4 Pilares Pedagógicos iluminados secuencialmente (*Comprendimos*, *Construimos*, *Enseñamos*, *Profesionalizamos*).
   - Panel de vinculación estratégica con la ETP de Mendoza y enlaces finales a portafolio y canal.

---

## 📁 4. Mapa de Archivos del Proyecto

| Archivo | Ruta | Descripción |
|---|---|---|
| **Presentación Principal** | [`index.html`](file:///d:/IPA2026/ACTUALIZACION%20CIENTIFICO%20TECNOLOGICA%202/presentacion_responsive/index.html) | Estructura semántica de las 8 diapositivas con modales y simuladores. |
| **Estilos Globales** | [`estilos.css`](file:///d:/IPA2026/ACTUALIZACION%20CIENTIFICO%20TECNOLOGICA%202/presentacion_responsive/estilos.css) | Sistema de diseño, animaciones, 3D Coverflow, temas y modo WCAG AAA. |
| **Lógica Interactiva** | [`js/presentacion.js`](file:///d:/IPA2026/ACTUALIZACION%20CIENTIFICO%20TECNOLOGICA%202/presentacion_responsive/js/presentacion.js) | Navegación por teclado/swipe/HUD, timer, simulador, carrusel y coverflow. |
| **Guion de Exposición** | [`documentacion/guion.html`](file:///d:/IPA2026/ACTUALIZACION%20CIENTIFICO%20TECNOLOGICA%202/presentacion_responsive/documentacion/guion.html) | Guion estructurado por slide (17 min exposición + 3 min preguntas) con cues `🎬` y pausas `⏸`. Imprimible. |
| **Guía de Estudio** | [`documentacion/guia_estudio.html`](file:///d:/IPA2026/ACTUALIZACION%20CIENTIFICO%20TECNOLOGICA%202/presentacion_responsive/documentacion/guia_estudio.html) | 6 frases clave, 12 flashcards interactivas, 4 preguntas del tribunal y checklist de 10 puntos. |
| **Imágenes Portafolio Básico** | `imagenes/portafolio_basico/` | `basico_1.png` a `basico_8.png` (producciones de alumnos). |
| **Imágenes Portafolio Avanzado** | `imagenes/portafolio_avanzado/` | `avanzado_1.png` a `avanzado_9.png` (componentes Vue 3). |
| **Línea de Tiempo** | `imagenes/linea_tiempo.png` | Infografía de trayectoria formativa. |
| **Certificado Oficial** | `imagenes/mi certificado.jpeg` | Certificado de Responsive Web Design (300 hs) de freeCodeCamp. |

---

## ⌨️ 5. Atajos de Teclado Disponibles

- `▶` / `Espacio` / `PageDown`: Avanzar diapositiva.
- `◀` / `PageUp`: Retroceder diapositiva.
- `Inicio` (`Home`): Ir a la Portada (Slide 1).
- `Fin` (`End`): Ir al Cierre (Slide 8).
- `T` / `t`: Activar/pausar el **Timer del Expositor** en el HUD (alerta amarilla a los 18 min, roja a los 20 min).
- `J` / `K`: Navegar el Coverflow 3D en la Diapositiva 7.
- `Esc`: Cerrar Lightbox, Simulador Mobile-First o Vista Pantalla Completa.
