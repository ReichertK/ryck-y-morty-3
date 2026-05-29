// Tipos del estado de una tarjeta. Los separo del componente porque los
// importan el lienzo, los controles y la función de descarga — mejor
// no acoplarlos.
import type { Personaje } from "../api/personajes";

export type Marco =
  | "polaroid"
  | "ficha"
  | "portal"
  | "rasgado"
  | "neon"
  | "sello";

export type Forma = "rectangular" | "cuadrada" | "circular" | "arco";

export type Orientacion = "vertical" | "horizontal";

// Filtro de dimensión sobre el lienzo. Cada uno mapea a un CSS filter
// + (opcional) overlay. Aplica DENTRO del nodo capturable así viaja
// al PNG descargado.
export type Dimension =
  | "ninguna"
  | "c137"
  | "cronenberg"
  | "purga"
  | "cable";

// Cosa que el usuario "pega" sobre la tarjeta. Hay dos familias:
//  - SVG vectorial (tipo === "portal" | "slime" | ...): se dibuja con
//    los componentes de adornosSvg.tsx.
//  - Imagen (tipo === "imagen"): sticker con avatar de la API, urlImagen
//    apunta al jpeg y etiqueta guarda el nombre para tooltip/a11y.
//
// Guardo x/y en porcentaje así la posición queda relativa al lienzo y
// no se rompe si cambio el tamaño.
export type Adorno = {
  id: string;          // id único de la instancia (no del catálogo)
  tipo: string;        // ej: "portal", "slime", "nave", "imagen"
  x: number;           // porcentaje horizontal (0..100)
  y: number;           // porcentaje vertical (0..100)
  tamano: number;      // tamaño en px
  rotacion: number;    // grados
  urlImagen?: string;  // solo si tipo === "imagen"
  etiqueta?: string;   // nombre humano (para tooltips / accesibilidad)
};

// Estado completo de la tarjeta. Vive en el Taller y se serializa
// para persistir o (en algún futuro) compartir.
export type EstadoTarjeta = {
  personaje: Personaje | null;
  textoSuperior: string;
  textoInferior: string;
  motivo: string;
  marco: Marco;
  forma: Forma;
  orientacion: Orientacion;
  colorFondo: string;       // hex o nombre CSS
  colorTexto: string;
  rotacionTarjeta: number;  // -8 a 8 grados, le da onda
  adornos: Adorno[];
  dimension: Dimension;     // filtro de "dimensión" sobre el lienzo
};
