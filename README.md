# Imprenta C-137 · React Edition

Versión modernizada del proyecto original [ryck-y-morty-2](../ryck-y-morty-2/), reescrita en React + TypeScript. Ya no es una tienda ficticia: es un **editor gratuito** donde armás tu tarjeta de Rick & Morty (marco, forma, paleta, motivo, adornos) y te bajás la imagen como PNG.

## Stack

- **Vite** + **React 18** + **TypeScript** (strict).
- **Tailwind CSS v4** con `@theme` para los tokens del proyecto (paleta, fuentes, sombras).
- **Framer Motion** para transiciones de página y micro-animaciones.
- **React Router v6** con `AnimatePresence` para entradas/salidas suaves.
- **html-to-image** para exportar el lienzo como PNG en alta resolución.
- **lucide-react** para iconos coherentes y livianos.
- Sin Bootstrap, sin jQuery, sin FontAwesome.

## Cómo correrlo

```powershell
cd c:\Users\Admin\proyectos\ryck-y-morty-3
npm install
npm run dev
```

Vite abre solo el navegador en `http://localhost:5173`. Para generar el build de producción: `npm run build` y luego `npm run preview` para servir lo construido.

## Estructura

```
ryck-y-morty-3/
├── index.html                  ← entrada (carga main.tsx)
├── package.json · vite.config.ts · tsconfig*.json
├── src/
│   ├── main.tsx                ← bootstrap de React + Router
│   ├── App.tsx                 ← rutas + transiciones + layout
│   ├── estilos/global.css      ← Tailwind v4 + tokens + utilidades
│   ├── api/personajes.ts       ← único punto de contacto con la API
│   ├── hooks/usePersonajes.ts  ← carga + cancelación con AbortController
│   ├── componentes/
│   │   ├── Encabezado.tsx
│   │   ├── Pie.tsx
│   │   ├── FondoEspacial.tsx   ← estrellas SVG + portales con blur
│   │   ├── TransicionPagina.tsx
│   │   └── Boton.tsx           ← un solo botón con variantes
│   ├── paginas/
│   │   ├── Inicio.tsx
│   │   ├── Galeria.tsx         ← grid + búsqueda + paginación
│   │   ├── Taller.tsx          ← el editor (corazón de la app)
│   │   ├── SobreNosotros.tsx
│   │   ├── Contacto.tsx
│   │   └── NoEncontrado.tsx
│   └── taller/
│       ├── tipos.ts            ← EstadoTarjeta, Adorno, Marco, Forma…
│       ├── catalogos.ts        ← MARCOS, FORMAS, PALETAS, MOTIVOS…
│       ├── adornosSvg.tsx      ← cada adorno es un SVG inline
│       ├── LienzoTarjeta.tsx   ← el preview que se descarga
│       ├── ControlesTaller.tsx ← la barra lateral con todas las opciones
│       └── descargarTarjeta.ts ← convierte el lienzo a PNG y dispara save
```

## Lo que se puede personalizar

- **Personaje** (de los 800+ de la API, con búsqueda por nombre).
- **Marco**: Polaroid · Ficha · Portal · Papel rasgado · Neón · Sello postal.
- **Forma**: Rectangular · Cuadrada · Circular · Lápida (arco).
- **Orientación**: Vertical · Horizontal.
- **Paleta**: presets temáticos + color pickers manuales para fondo y texto.
- **Rotación**: slider de -8° a 8°.
- **Motivo**: presets ("¡Feliz cumpleaños!", etc.) + texto libre arriba y abajo.
- **Adornos**: 7 SVG pegables (portal, slime, baba, estrella, planeta, rayo, ojo) con botón "Sorprendeme".
- Botón **Sorprendeme** que combina valores aleatorios coherentes.

## Decisiones de diseño relevantes

- **Tokens en `@theme`**: la paleta vive en un único bloque CSS. Cambiar el verde portal se propaga a TODO el sitio en una línea.
- **Estado de la tarjeta como un solo objeto** (`EstadoTarjeta`) tipado en TypeScript. Esto permite futuras features como "guardar diseño", "compartir link" o "deshacer/rehacer" sin cambiar la arquitectura.
- **El lienzo es el componente que se descarga literal**: lo que ves en pantalla es lo que sale en el PNG. Sin canvas dibujado a mano, sin servidor.
- **SVG inline para los adornos**: `html-to-image` los captura sin esperar carga de assets externos.
- **`AbortController` en el hook de personajes**: evita que respuestas viejas pisen las nuevas si el usuario tipea rápido.
- **`crossOrigin="anonymous"` en las imágenes**: necesario para que `html-to-image` pueda dibujarlas en el canvas (la API de Rick & Morty lo permite).

## Lo que quedó como deuda (a propósito)

- **Mover/redimensionar adornos con el mouse**: ahora se agregan al centro con leve jitter. Falta drag & drop. Lo dejé estructurado (`x`, `y`, `tamano`, `rotacion` en porcentajes/grados) para que se enchufe sin refactor.
- **Persistencia local**: hoy si refrescás se pierde el diseño. Falta `localStorage` con la serialización de `EstadoTarjeta` (que ya es JSON-friendly).
- **Compartir por link**: con la misma serialización, encodearlo en query string y reconstruir desde la URL.
- **Backend real del formulario de contacto**: hoy simula envío.
- **Tests**: con Vitest + Testing Library cuando crezca.

## Paleta

| Token | Color | Para qué |
|---|---|---|
| `--color-portal` | `#97ce4c` | acciones principales, focos, el verde de la serie |
| `--color-cosmos` | `#44318d` | acentos secundarios, fondos cálidos |
| `--color-acido` | `#ffd23f` | el amarillo del título de la serie |
| `--color-sello` | `#ec1c24` | errores, advertencias, rojo de estampilla |
| `--color-espacio` | `#0b0d1f` | fondo principal |
| `--color-papel` | `#f6efd8` | texto principal, fondo crema de tarjetas clásicas |
