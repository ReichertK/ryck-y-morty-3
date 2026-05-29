// Adornos vectoriales para la tarjeta. Cada uno es un componente puro
// que recibe { tamano, rotacion } y devuelve un SVG inline. Los dejo
// inline (no como archivos sueltos) para que html-to-image los capture
// sin tener que esperar fetches.
import type { TipoAdorno } from "./catalogos";

type Props = { tamano?: number; rotacion?: number };

function envoltura(
  contenido: React.ReactNode,
  tamano: number,
  rotacion: number
) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 100 100"
      style={{ transform: `rotate(${rotacion}deg)` }}
    >
      {contenido}
    </svg>
  );
}

// ----- Genéricos ----------------------------------------------------

function Portal({ tamano = 80, rotacion = 0 }: Props) {
  // Un portal estilo Rick: óvalo verde con halo y centro púrpura.
  return envoltura(
    <>
      <defs>
        <radialGradient id="portal-grad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#44318d" />
          <stop offset="50%" stopColor="#97ce4c" />
          <stop offset="100%" stopColor="#4f8a2c" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="50" rx="44" ry="32" fill="url(#portal-grad)" />
      <ellipse
        cx="50"
        cy="50"
        rx="36"
        ry="24"
        fill="none"
        stroke="#b8e26a"
        strokeWidth="2"
        opacity="0.7"
      />
    </>,
    tamano,
    rotacion
  );
}

function Slime({ tamano = 60, rotacion = 0 }: Props) {
  return envoltura(
    <path
      d="M50 8 C70 8 88 30 84 55 C82 75 65 92 50 92 C32 92 16 78 16 56 C16 32 32 8 50 8 Z"
      fill="#97ce4c"
      stroke="#4f8a2c"
      strokeWidth="2"
    />,
    tamano,
    rotacion
  );
}

function Baba({ tamano = 70, rotacion = 0 }: Props) {
  return envoltura(
    <>
      <path
        d="M10 10 Q30 10 30 30 Q30 50 40 60 Q50 70 50 85 Q50 95 45 95 Q40 95 40 85 Q40 75 30 65 Q20 55 20 35 Q20 20 10 18 Z"
        fill="#b8e26a"
      />
      <path
        d="M55 10 Q70 12 72 30 Q73 45 80 55 Q86 65 85 80 Q84 90 78 88 Q72 86 72 75 Q72 65 65 55 Q58 45 58 28 Q58 18 55 10 Z"
        fill="#97ce4c"
      />
    </>,
    tamano,
    rotacion
  );
}

function Estrella({ tamano = 40, rotacion = 0 }: Props) {
  return envoltura(
    <polygon
      points="50,5 61,38 95,38 67,58 78,92 50,72 22,92 33,58 5,38 39,38"
      fill="#ffd23f"
      stroke="#1c2733"
      strokeWidth="2"
    />,
    tamano,
    rotacion
  );
}

function Planeta({ tamano = 70, rotacion = 0 }: Props) {
  return envoltura(
    <>
      <circle cx="50" cy="50" r="32" fill="#44318d" />
      <ellipse
        cx="50"
        cy="55"
        rx="46"
        ry="8"
        fill="none"
        stroke="#ffd23f"
        strokeWidth="3"
      />
      <circle cx="38" cy="42" r="6" fill="#6c4ab6" />
      <circle cx="58" cy="55" r="4" fill="#6c4ab6" />
    </>,
    tamano,
    rotacion
  );
}

function Rayo({ tamano = 50, rotacion = 0 }: Props) {
  return envoltura(
    <polygon
      points="55,5 25,55 45,55 35,95 75,40 55,40 65,5"
      fill="#ffd23f"
      stroke="#1c2733"
      strokeWidth="2"
    />,
    tamano,
    rotacion
  );
}

function Ojo({ tamano = 60, rotacion = 0 }: Props) {
  return envoltura(
    <>
      <ellipse cx="50" cy="50" rx="40" ry="28" fill="#f6efd8" />
      <ellipse cx="50" cy="50" rx="18" ry="22" fill="#97ce4c" />
      <circle cx="50" cy="50" r="10" fill="#1c2733" />
      <circle cx="46" cy="45" r="4" fill="#f6efd8" />
    </>,
    tamano,
    rotacion
  );
}

// ----- Temáticos Rick & Morty --------------------------------------

function Nave({ tamano = 80, rotacion = 0 }: Props) {
  // Nave de Rick: platillo volador. Cuerpo gris, cúpula verde, propulsor.
  return envoltura(
    <>
      <ellipse cx="50" cy="60" rx="42" ry="10" fill="#7a8290" />
      <ellipse cx="50" cy="58" rx="42" ry="6" fill="#4a525f" />
      <path
        d="M28 56 Q50 30 72 56 Z"
        fill="#97ce4c"
        stroke="#4f8a2c"
        strokeWidth="2"
      />
      <ellipse cx="46" cy="44" rx="6" ry="4" fill="#f6efd8" opacity="0.6" />
      <circle cx="32" cy="63" r="2.5" fill="#ffd23f" />
      <circle cx="50" cy="65" r="2.5" fill="#ffd23f" />
      <circle cx="68" cy="63" r="2.5" fill="#ffd23f" />
      <path d="M40 70 L36 84 L44 80 Z" fill="#ffd23f" opacity="0.7" />
      <path d="M60 70 L64 84 L56 80 Z" fill="#ffd23f" opacity="0.7" />
    </>,
    tamano,
    rotacion
  );
}

function PortalGun({ tamano = 70, rotacion = 0 }: Props) {
  // Portal gun: pistola gris con cámara verde brillante.
  return envoltura(
    <>
      {/* mango */}
      <rect x="42" y="55" width="14" height="30" rx="3" fill="#3a3f4a" />
      {/* cuerpo */}
      <rect x="22" y="30" width="56" height="32" rx="6" fill="#5a6270" />
      {/* detalles */}
      <rect x="22" y="40" width="56" height="4" fill="#3a3f4a" />
      {/* cámara verde */}
      <circle cx="50" cy="46" r="11" fill="#0b0d1f" />
      <circle cx="50" cy="46" r="8" fill="#97ce4c" />
      <circle cx="47" cy="43" r="3" fill="#d8ff8a" />
      {/* cañón */}
      <rect x="48" y="18" width="4" height="14" fill="#3a3f4a" />
      <circle cx="50" cy="18" r="3" fill="#97ce4c" />
    </>,
    tamano,
    rotacion
  );
}

function Plumbus({ tamano = 70, rotacion = 0 }: Props) {
  // Plumbus: el objeto absurdo. Cuerpo rosado tipo banana torcida con
  // bulto saliente. Todo el mundo tiene uno.
  return envoltura(
    <>
      <path
        d="M30 20 Q44 12 56 22 Q70 32 64 52 Q60 70 50 72 Q40 74 36 60 Q32 50 24 44 Q18 38 22 30 Q24 24 30 20 Z"
        fill="#e89aa3"
        stroke="#a4525c"
        strokeWidth="2"
      />
      {/* dinglebop saliente */}
      <ellipse
        cx="60"
        cy="80"
        rx="6"
        ry="14"
        fill="#c47883"
        stroke="#a4525c"
        strokeWidth="2"
      />
      {/* grumbo */}
      <circle cx="40" cy="34" r="4" fill="#a4525c" />
    </>,
    tamano,
    rotacion
  );
}

function Meeseeks({ tamano = 70, rotacion = 0 }: Props) {
  // Sr. Meeseeks: cabeza azul ovalada, ojos saltones, boca abierta
  // "OOOOH YEAH!".
  return envoltura(
    <>
      <ellipse cx="50" cy="55" rx="32" ry="40" fill="#5dc2e0" />
      {/* ojos */}
      <circle cx="38" cy="42" r="9" fill="#f6efd8" />
      <circle cx="62" cy="42" r="9" fill="#f6efd8" />
      <circle cx="38" cy="42" r="3" fill="#1c2733" />
      <circle cx="62" cy="42" r="3" fill="#1c2733" />
      {/* boca abierta */}
      <ellipse cx="50" cy="72" rx="10" ry="8" fill="#1c2733" />
      <path
        d="M44 72 Q50 74 56 72"
        stroke="#f6efd8"
        strokeWidth="1.5"
        fill="none"
      />
    </>,
    tamano,
    rotacion
  );
}

function Cromulon({ tamano = 80, rotacion = 0 }: Props) {
  // Cromulón (cabeza gigante con un solo ojo, "Show me what you got!").
  return envoltura(
    <>
      <circle cx="50" cy="52" r="38" fill="#e89a4b" />
      <circle cx="50" cy="52" r="38" fill="none" stroke="#a45a2b" strokeWidth="2" />
      {/* ojo único */}
      <ellipse cx="50" cy="42" rx="16" ry="14" fill="#f6efd8" />
      <circle cx="50" cy="44" r="8" fill="#97ce4c" />
      <circle cx="50" cy="44" r="4" fill="#1c2733" />
      {/* sonrisa */}
      <path
        d="M30 68 Q50 82 70 68"
        stroke="#1c2733"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* diente */}
      <rect x="48" y="68" width="4" height="6" fill="#f6efd8" />
    </>,
    tamano,
    rotacion
  );
}

function Cohete({ tamano = 60, rotacion = 0 }: Props) {
  // Cohete clasiquito tipo dibujito. Para mezclar con los otros.
  return envoltura(
    <>
      <path
        d="M50 8 Q62 28 62 60 L50 70 L38 60 Q38 28 50 8 Z"
        fill="#f6efd8"
        stroke="#1c2733"
        strokeWidth="2"
      />
      <circle cx="50" cy="36" r="6" fill="#5dc2e0" stroke="#1c2733" strokeWidth="1.5" />
      {/* alas */}
      <path d="M38 56 L26 72 L38 68 Z" fill="#ec1c24" stroke="#1c2733" strokeWidth="1.5" />
      <path d="M62 56 L74 72 L62 68 Z" fill="#ec1c24" stroke="#1c2733" strokeWidth="1.5" />
      {/* fuego */}
      <path
        d="M44 70 Q50 90 56 70 Q53 78 50 72 Q47 78 44 70 Z"
        fill="#ffd23f"
        stroke="#ec1c24"
        strokeWidth="1.5"
      />
    </>,
    tamano,
    rotacion
  );
}

// ----- Sellos de pasaporte multiversal ----------------------------

/**
 * Helper para sellos tipo "aduana": círculo con texto curvo arriba y
 * abajo, una estrella central, y un look envejecido por tinta.
 */
function selloGenerico(
  texto1: string,
  texto2: string,
  color: string,
  tamano: number,
  rotacion: number,
  variante: "estrella" | "portal" | "check"
) {
  // Uso un id único por sello para que los <path> de texto curvo no
  // colisionen si hay varios sellos en la misma tarjeta.
  const id = `sello-${Math.random().toString(36).slice(2, 8)}`;
  return envoltura(
    <>
      <defs>
        <path id={`${id}-arriba`} d="M 50,50 m -38,0 a 38,38 0 1,1 76,0" fill="none" />
        <path id={`${id}-abajo`} d="M 50,50 m -38,0 a 38,38 0 1,0 76,0" fill="none" />
      </defs>
      {/* Doble círculo (look de sello oficial) */}
      <circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="2.5" opacity="0.85" />
      <circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth="1.2" opacity="0.8" />
      {/* Texto curvo */}
      <text fill={color} fontSize="9" fontFamily="monospace" fontWeight="bold" letterSpacing="1" opacity="0.95">
        <textPath href={`#${id}-arriba`} startOffset="50%" textAnchor="middle">
          {texto1}
        </textPath>
      </text>
      <text fill={color} fontSize="7.5" fontFamily="monospace" letterSpacing="2" opacity="0.85">
        <textPath href={`#${id}-abajo`} startOffset="50%" textAnchor="middle">
          {texto2}
        </textPath>
      </text>
      {/* Centro */}
      {variante === "estrella" && (
        <polygon
          points="50,30 54,44 68,44 57,52 61,66 50,58 39,66 43,52 32,44 46,44"
          fill={color}
          opacity="0.85"
        />
      )}
      {variante === "portal" && (
        <>
          <ellipse cx="50" cy="50" rx="16" ry="11" fill={color} opacity="0.85" />
          <ellipse cx="50" cy="50" rx="11" ry="7" fill="#0b0d1f" opacity="0.6" />
        </>
      )}
      {variante === "check" && (
        <path
          d="M 36,50 L 46,60 L 66,40"
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {/* Líneas de tinta envejecida (rasguños tenues) */}
      <line x1="20" y1="20" x2="80" y2="80" stroke={color} strokeWidth="1" opacity="0.15" />
    </>,
    tamano,
    rotacion
  );
}

function SelloFederacion({ tamano = 90, rotacion = -8 }: Props) {
  return selloGenerico(
    "FEDERACIÓN GALÁCTICA",
    "★ APROBADO ★",
    "#ec1c24",
    tamano,
    rotacion,
    "estrella"
  );
}

function SelloCiudadela({ tamano = 90, rotacion = 6 }: Props) {
  return selloGenerico(
    "CIUDADELA DE LOS RICKS",
    "DIMENSIÓN C-137",
    "#97ce4c",
    tamano,
    rotacion,
    "portal"
  );
}

function SelloAprobado({ tamano = 90, rotacion = -3 }: Props) {
  return selloGenerico(
    "CONSEJO DE RICKS",
    "VISADO INTERDIMENSIONAL",
    "#44318d",
    tamano,
    rotacion,
    "check"
  );
}

// ----- Mapa público -----------------------------------------------

export const ADORNOS: Record<TipoAdorno, (p: Props) => React.JSX.Element> = {
  portal: Portal,
  slime: Slime,
  baba: Baba,
  estrella: Estrella,
  planeta: Planeta,
  rayo: Rayo,
  ojo: Ojo,
  nave: Nave,
  portalgun: PortalGun,
  plumbus: Plumbus,
  meeseeks: Meeseeks,
  cromulon: Cromulon,
  cohete: Cohete,
  "sello-federacion": SelloFederacion,
  "sello-ciudadela": SelloCiudadela,
  "sello-aprobado": SelloAprobado,
};

/** Nombre humano de cada tipo, para tooltips. */
export const NOMBRE_ADORNO: Record<TipoAdorno, string> = {
  portal: "Portal",
  slime: "Slime",
  baba: "Baba",
  estrella: "Estrella",
  planeta: "Planeta",
  rayo: "Rayo",
  ojo: "Ojo alien",
  nave: "Nave de Rick",
  portalgun: "Portal Gun",
  plumbus: "Plumbus",
  meeseeks: "Sr. Meeseeks",
  cromulon: "Cromulón",
  cohete: "Cohete",
  "sello-federacion": "Sello Federación Galáctica",
  "sello-ciudadela": "Sello Ciudadela de los Ricks",
  "sello-aprobado": "Visado interdimensional",
};
