// Fondo del sitio: foto real de la Nebulosa Carina (NASA, dominio
// público, ~41 KB) + tinte verde-violeta para que combine con la paleta.
// Encima va un SVG estático chico (estrellas + portal + 2 naves) y
// arriba de todo un OVNI con Framer Motion.
//
// Versión anterior usaba <feGaussianBlur> y <animate> SMIL que costaban
// caro en GPU; ahora todo lo decorativo es estático y el navegador lo
// cachea como capa. La única animación viva es la nave (transform puro).
import { motion, useReducedMotion } from "framer-motion";

// import.meta.env.BASE_URL respeta el `base` del vite.config, así la
// URL funciona igual en local (/) y publicada en GitHub Pages (/repo/).
const URL_NEBULOSA = `${import.meta.env.BASE_URL}img/nebulosa-carina.jpg`;

export default function FondoEspacial() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Capa 1: foto base. Opacity baja para que no robe foco; el
          filter la pinta hacia verde-violeta así combina con la paleta. */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${URL_NEBULOSA})`,
          opacity: 0.45,
          filter: "saturate(1.15) hue-rotate(-10deg) contrast(1.05)",
        }}
      />

      {/* Capa 2: tinte para que la nebulosa combine con la paleta. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(151,206,76,0.25) 0%, transparent 55%), " +
            "radial-gradient(ellipse at 20% 80%, rgba(68,49,141,0.35) 0%, transparent 60%), " +
            "linear-gradient(180deg, rgba(11,13,31,0.55) 0%, rgba(11,13,31,0.35) 50%, rgba(11,13,31,0.65) 100%)",
        }}
      />

      {/* Capa 3: SVG decorativo liviano. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="portal-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0b0d1f" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#44318d" stopOpacity="0.6" />
            <stop offset="75%" stopColor="#97ce4c" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#97ce4c" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Portal de fondo — estático, sin SMIL: no le pega un mango al CPU. */}
        <ellipse cx="1280" cy="220" rx="180" ry="60" fill="url(#portal-bg)" />

        {/* 24 estrellas en posiciones fijas. Hardcodeadas a propósito:
            random rompería la consistencia entre renders. */}
        {[
          [120, 120, 1.4], [300, 60, 1], [500, 180, 1.2],
          [780, 80, 0.9], [950, 220, 1.3], [1450, 90, 1.1],
          [60, 420, 1.2], [240, 540, 1], [450, 620, 0.9],
          [620, 480, 1.4], [820, 580, 1.1], [1100, 660, 1.2],
          [1320, 580, 1], [1500, 480, 1.3], [1380, 920, 1.1],
          [680, 900, 1.2], [180, 880, 0.9], [920, 880, 1.3],
          [380, 320, 0.8], [1180, 380, 1], [560, 760, 1.1],
          [60, 700, 0.9], [1480, 720, 1.2], [800, 360, 1],
        ].map(([x, y, r], i) => (
          <circle
            key={`star-${i}`}
            cx={x}
            cy={y}
            r={(r as number) * 1.4}
            fill="#f6efd8"
            opacity="0.75"
          />
        ))}

        {/* Dos naves chiquititas de decoración. */}
        <g opacity="0.55">
          <g transform="translate(1180, 140) scale(0.6)">
            <ellipse cx="0" cy="3" rx="20" ry="3" fill="#7a8290" />
            <path d="M-12 0 Q0 -10 12 0 Z" fill="#97ce4c" />
            <circle cx="-6" cy="4" r="1" fill="#ffd23f" />
            <circle cx="0" cy="5" r="1" fill="#ffd23f" />
            <circle cx="6" cy="4" r="1" fill="#ffd23f" />
          </g>
          <g transform="translate(380, 760) scale(0.4) rotate(-8)">
            <ellipse cx="0" cy="3" rx="20" ry="3" fill="#7a8290" />
            <path d="M-12 0 Q0 -10 12 0 Z" fill="#97ce4c" />
          </g>
        </g>
      </svg>

      {/* Capa 4: viñeta para oscurecer bordes y resaltar el contenido. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(11, 13, 31, 0.65) 100%)",
        }}
      />

      {/* Capa 5: OVNI errante (único bicho animado del fondo). */}
      <NaveErrante />
    </div>
  );
}

// Nave que cruza la pantalla cada ~45s. Top 10vh así no se pisa con
// lo que se está leyendo. Si el usuario tiene reduced-motion no se
// renderiza directamente, pa qué marearlo.
function NaveErrante() {
  const reducirMov = useReducedMotion();
  if (reducirMov) return null;

  return (
    <motion.div
      initial={{ x: "-15vw" }}
      animate={{ x: "115vw" }}
      transition={{
        duration: 25,
        repeat: Infinity,
        repeatDelay: 20,
        ease: "linear",
      }}
      style={{
        position: "absolute",
        top: "10vh",
        opacity: 0.6,
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
        willChange: "transform",
      }}
    >
      {/* Dos transforms anidados (x linear + y wobble) para que el
          compositor las componga por separado. */}
      <motion.div
        animate={{ y: [0, -8, 4, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="90" height="60" viewBox="0 0 100 60">
          <ellipse cx="50" cy="38" rx="42" ry="8" fill="#7a8290" />
          <ellipse cx="50" cy="36" rx="42" ry="5" fill="#4a525f" />
          <path
            d="M28 34 Q50 12 72 34 Z"
            fill="#97ce4c"
            stroke="#4f8a2c"
            strokeWidth="1.5"
          />
          <ellipse cx="44" cy="24" rx="6" ry="3" fill="#f6efd8" opacity="0.6" />
          <circle cx="30" cy="40" r="2" fill="#ffd23f" />
          <circle cx="50" cy="42" r="2" fill="#ec1c24" />
          <circle cx="70" cy="40" r="2" fill="#ffd23f" />
          <path d="M0 38 L25 36 L25 40 Z" fill="#97ce4c" opacity="0.5" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
