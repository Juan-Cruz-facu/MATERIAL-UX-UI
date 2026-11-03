# MATERIAL-UX-UI
# TP3 — HTML y CSS

Trabajo Práctico de Diseño UX-UI (2026) — Licenciatura en Sistemas de Información.
20 ejercicios de nivel básico a medio/avanzado, cada uno resuelto en su propia carpeta con `index.html` y `styles.css`.

## Estructura del repositorio

Cada carpeta `ejXX` corresponde a un ejercicio del enunciado.

## Ejercicios resueltos

### Bloque 1 — Nivel Básico
- **Ejercicio 1** — Estructura HTML básica (`<!DOCTYPE>`, `<head>`, `<h1>`, `<p>`, `<img>` con `alt`).
- **Ejercicio 2** — Listas y enlaces (`<ol>`, `<ul>`, `<a target="_blank">`).
- **Ejercicio 3** — Tabla de datos con `<thead>`/`<tbody>`/`<tfoot>`, `colspan` y `rowspan`.
- **Ejercicio 4** — Formulario de contacto con `<label>` asociado y validación nativa (`required`).
- **Ejercicio 5** — Primeros estilos CSS externos (tipografía, color, fondo).
- **Ejercicio 6** — Selectores de clase, ID y descendiente.
- **Ejercicio 7** — Modelo de caja: tarjetas iguales con `box-sizing: border-box`.

### Bloque 2 — Nivel Intermedio
- **Ejercicio 8** — Navbar con Flexbox (`justify-content`, `align-items`).
- **Ejercicio 9** — Galería de productos con `flex-wrap` y `flex-basis`.
- **Ejercicio 10** — Layout de página con CSS Grid y `grid-template-areas`.
- **Ejercicio 11** — Pseudo-clases (`:hover`, `:nth-child`) y pseudo-elemento (`::before`).
- **Ejercicio 12** — Posicionamiento: botón fijo (`position: fixed`) y tooltip (`position: absolute`).
- **Ejercicio 13** — Formulario estilizado con `:focus`, `:hover`, `:active` y transiciones.
- **Ejercicio 14** — Variables CSS en `:root` + modo oscuro simple redefiniendo variables.

### Bloque 3 — Nivel Medio/Avanzado
- **Ejercicio 15** — Diseño responsivo con media queries (enfoque **desktop first**: se justifica porque el layout del Ejercicio 10 ya estaba pensado para escritorio con sidebar fijo).
- **Ejercicio 16** — Animaciones con `@keyframes` (spinner + fade-in/slide-up).
- **Ejercicio 17** — Menú hamburguesa solo CSS, con el truco del checkbox oculto (`:checked` + combinador `~`).
- **Ejercicio 18** — Grid avanzado tipo mosaico con `auto-fill`, `minmax()` y `grid-auto-flow: dense`.
- **Ejercicio 19** — Formulario multi-step con radio buttons ocultos y validación visual (`:invalid`/`:valid`).
- **Ejercicio 20** — Landing page integradora: navbar fija con scroll suave, hero, servicios en Grid, testimonios en carrusel (`scroll-snap`), formulario de contacto y footer semántico.

## Decisiones de diseño relevantes

- Se usó una paleta de colores y espaciados consistente mediante variables CSS (`--color-primario`, `--color-secundario`, `--espaciado`, `--radio-borde`), reutilizada especialmente en los Ejercicios 14 y 20.
- En el Ejercicio 15 se optó por un enfoque **desktop first** en lugar de mobile first.
- En los Ejercicios 17 y 19 se resolvió la interactividad (menú colapsable y formulario multi-paso) sin JavaScript, usando el truco de inputs ocultos (`checkbox`/`radio`) combinado con selectores `:checked` y `~`.
- Se priorizó HTML5 semántico (`<header>`, `<main>`, `<section>`, `<footer>`) y accesibilidad básica (`label for` vinculado a cada campo, `alt` en imágenes).

## Cómo ver el proyecto

Abrir cualquier `ejXX/index.html` con Live Server (VSCode) o directamente en el navegador.