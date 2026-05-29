// Listas de opciones que ofrece el editor. Mantenidas a mano: son
// pocas, cambian poco y así la UI no depende de pedirlas a ningún lado.
import type { Marco, Forma, Orientacion, Dimension } from "./tipos";

// Filtros visuales sobre el lienzo. Cada uno aplica un CSS filter +
// opcionalmente un overlay (ruido, glow) que se rendea como capa
// encima. Todo estático: html-to-image lo captura sin drama.
export const DIMENSIONES: {
  id: Dimension;
  nombre: string;
  chiste: string;
  filter: string;
  overlay?: "ruido" | "rayos" | "glow-portal";
  schmeckles: number;
}[] = [
  {
    id: "ninguna",
    nombre: "Estándar",
    chiste: "Dimensión aburrida (la nuestra).",
    filter: "none",
    schmeckles: 0,
  },
  {
    id: "c137",
    nombre: "C-137",
    chiste: "Saturación máxima. Resplandor portal incluido.",
    filter: "saturate(1.45) brightness(1.06) contrast(1.05)",
    overlay: "glow-portal",
    schmeckles: 7,
  },
  {
    id: "cronenberg",
    nombre: "Cronenberg",
    chiste: "Carne orgánica y aberración cromática.",
    filter: "hue-rotate(305deg) saturate(1.8) contrast(1.2)",
    schmeckles: 9,
  },
  {
    id: "purga",
    nombre: "Planeta de la Purga",
    chiste: "Rojo, oscuro, alto contraste. Cuidado afuera.",
    filter: "sepia(0.5) hue-rotate(-25deg) saturate(2.2) contrast(1.35) brightness(0.85)",
    schmeckles: 8,
  },
  {
    id: "cable",
    nombre: "Cable interdimensional",
    chiste: "Estática de TV analógica. Ojo con el volumen.",
    filter: "contrast(1.18) saturate(0.55) hue-rotate(180deg)",
    overlay: "ruido",
    schmeckles: 10,
  },
];

// Lo que larga Mr. Meeseeks cuando lo invocás desde la caja.
export const FRASES_MEESEEKS = [
  "¡Soy Mr. Meeseeks! ¡Mirame!",
  "¡La existencia es dolor!",
  "¡Listo, jefe! ¡POOF!",
  "¡Hacé los cambios y meté la pelota!",
  "¡Mr. Meeseeks no se cuestiona, se obedece!",
  "¡Wubba lubba dub dub! …no, esa no es mi frase.",
];


export const MARCOS: { id: Marco; nombre: string; chiste: string }[] = [
  { id: "polaroid", nombre: "Polaroid", chiste: "Como las del abuelo, pero más limpias." },
  { id: "ficha", nombre: "Ficha de archivo", chiste: "Expediente clasificado del Concilio." },
  { id: "portal", nombre: "Portal", chiste: "Marco con onda de portal gun." },
  { id: "rasgado", nombre: "Papel rasgado", chiste: "Como si lo arrancaras de un cuaderno." },
  { id: "neon", nombre: "Neón cósmico", chiste: "Para los que ven la serie de noche." },
  { id: "sello", nombre: "Sello postal", chiste: "Bordes dentados, recuerdo del correo." },
];

export const FORMAS: { id: Forma; nombre: string }[] = [
  { id: "rectangular", nombre: "Rectangular" },
  { id: "cuadrada", nombre: "Cuadrada" },
  { id: "circular", nombre: "Circular" },
  { id: "arco", nombre: "Lápida (arco)" },
];

export const ORIENTACIONES: { id: Orientacion; nombre: string }[] = [
  { id: "vertical", nombre: "Vertical" },
  { id: "horizontal", nombre: "Horizontal" },
];

// Motivos rápidos para arrancar la tarjeta. Igual el usuario puede
// pisarlos escribiendo el suyo en el input.
export const MOTIVOS: { id: string; texto: string }[] = [
  { id: "cumpleanios", texto: "¡Feliz cumpleaños!" },
  { id: "navidad", texto: "¡Feliz navidad!" },
  { id: "aniversario", texto: "¡Feliz aniversario!" },
  { id: "gracias", texto: "Gracias, en serio." },
  { id: "graduacion", texto: "¡Te graduaste, máquina!" },
  { id: "porque-si", texto: "Porque sí, te lo merecés." },
  { id: "wubba", texto: "Wubba lubba dub dub" },
];

// Adornos vectoriales. Sumé los íconos clásicos del show (nave de Rick,
// portal gun, plumbus, caja de Meeseeks, Cromulón) además de los
// genéricos así la tarjeta tiene onda sin esfuerzo.
export const TIPOS_ADORNO = [
  "portal",
  "slime",
  "baba",
  "estrella",
  "planeta",
  "rayo",
  "ojo",
  "nave",
  "portalgun",
  "plumbus",
  "meeseeks",
  "cromulon",
  "cohete",
  "sello-federacion",
  "sello-ciudadela",
  "sello-aprobado",
] as const;

export type TipoAdorno = (typeof TIPOS_ADORNO)[number];

// Mini-personajes para pegar como stickers. Uso /character/avatar de
// la API (300×300 ya recortado). Si algún id se cae, el lienzo lo
// maneja con onError y simplemente no muestra la imagen.
// IDs curados a mano: los más reconocibles del show.
export const MINIS_PERSONAJE: { id: number; nombre: string }[] = [
  { id: 1, nombre: "Rick Sanchez" },
  { id: 2, nombre: "Morty Smith" },
  { id: 3, nombre: "Summer Smith" },
  { id: 4, nombre: "Beth Smith" },
  { id: 5, nombre: "Jerry Smith" },
  { id: 6, nombre: "Abradolf Lincler" },
  { id: 8, nombre: "Alien Morty" },
  { id: 38, nombre: "Birdperson" },
  { id: 71, nombre: "Concerto" },
  { id: 118, nombre: "Hemorrhage" },
  { id: 244, nombre: "Mr. Poopybutthole" },
  { id: 265, nombre: "Pickle Rick" },
  { id: 271, nombre: "Mr. Meeseeks" },
  { id: 332, nombre: "Squanchy" },
  { id: 411, nombre: "Scary Terry" },
  { id: 478, nombre: "Snowball" },
];

// Paletas armadas. Igual hay color pickers si el usuario quiere algo propio.
export const PALETAS: { nombre: string; fondo: string; texto: string }[] = [
  { nombre: "Papel clásico", fondo: "#f6efd8", texto: "#1c2733" },
  { nombre: "Portal nocturno", fondo: "#0b0d1f", texto: "#97ce4c" },
  { nombre: "Cosmos", fondo: "#44318d", texto: "#ffd23f" },
  { nombre: "Slime", fondo: "#b8e26a", texto: "#1c2733" },
  { nombre: "Sello rojo", fondo: "#ec1c24", texto: "#f6efd8" },
];

// Citas mitícas para el botón "frase del show".
export const FRASES_ICONICAS = [
  "Wubba lubba dub dub",
  "And awaaay we go!",
  "Get schwifty",
  "Pickle Riiiiick!",
  "Tiny Rick! Tiny Rick!",
  "I'm Mr. Meeseeks, look at me!",
  "Show me what you got",
  "Existence is pain",
  "Don't think about it",
  "Lick lick lick my balls",
  "Schwifty in here",
  "Aw geez, Rick\u2026",
  "That's the wayyy the news goes!",
  "Riggity riggity wrecked, son",
  "Nobody exists on purpose",
];

// Mensajes con humor para estados vacíos.
export const FRASES_VACIAS = [
  "Esa búsqueda no devolvió ningún Rick. Probá con otra dimensión.",
  "Vacío como el corazón de Jerry. Cambiá algún filtro.",
  "Ni con el portal gun lo encuentro. Reformulá, capo.",
  "Cero match. ¿Seguro que ese personaje no es de tu cabeza?",
];

export const FRASES_ERROR = [
  "El servidor anda más perdido que Morty en una aventura. Dale otra.",
  "Algo en el continuum se rompió. No es tu culpa (probablemente).",
  "Conexión interdimensional inestable. Tirá de nuevo en un toque.",
  "La API nos colgó. Cosas que pasan cuando el universo es infinito.",
];

// Especies frecuentes (la API tiene más, pero estas son las que valen
// la pena exponer como atajo de filtro).
export const ESPECIES_COMUNES = [
  "Human",
  "Alien",
  "Humanoid",
  "Robot",
  "Animal",
  "Cronenberg",
  "Mythological Creature",
  "Disease",
  "Poopybutthole",
] as const;

// Subtipos (campo "type" de la API) que valen como filtro rápido.
export const TIPOS_COMUNES = [
  "Genetic experiment",
  "Parasite",
  "Clone",
  "Superhuman",
  "Cyborg",
  "Hologram",
] as const;
