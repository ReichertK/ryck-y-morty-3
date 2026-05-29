// Atajamos el Konami code acá. Si el loco lo saca, le tiramos el portal
// real con feTurbulence (textura líquida de verdad, no un degradé pobre)
// y un Rick rompiendo la cuarta pared. El listener vive sólo en este
// componente: cuando se desmonta, se va con él.
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "./Toast";

const SECUENCIA = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];

// Frases de Rick rompiendo la cuarta pared. Pickeo random cuando se
// abre el portal así no es siempre la misma.
const FRASES_RICK = [
  "¿En serio buscaste esto? Andá a estudiar, Morty.",
  "Felicitaciones, encontraste un easter egg. Te debo cero Schmeckles.",
  "*Eructo* Sabía que ibas a llegar acá. Predije esta línea de tiempo hace tres temporadas.",
  "Bienvenido a la C-137. Acá las cookies son de verdad y trackean tu alma.",
  "Konami code en 2026… amigo, tenés más tiempo libre que el Consejo de Ricks.",
];

export default function EasterEggPortal() {
  const [activo, setActivo] = useState(false);
  const [frase, setFrase] = useState("");
  const { aviso } = useToast();

  useEffect(() => {
    // El progreso es una variable de closure, no state. Si fuera state
    // disparaba un re-render por cada tecla, que es regalado.
    let progreso = 0;

    function manejarTecla(ev: KeyboardEvent) {
      // Si está tipeando en un form, no le robo las teclas.
      const t = ev.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
        return;
      }

      const tecla = ev.key.length === 1 ? ev.key.toLowerCase() : ev.key;
      const esperada = SECUENCIA[progreso];
      if (tecla === esperada) {
        progreso += 1;
        if (progreso === SECUENCIA.length) {
          setFrase(FRASES_RICK[Math.floor(Math.random() * FRASES_RICK.length)]);
          setActivo(true);
          aviso("Portal abierto. Bienvenido a la C-137, Morty.", { tipo: "ok", duracion: 5000 });
          progreso = 0;
        }
      } else {
        // Si la tecla equivocada coincide con el primer paso, arranco
        // el conteo en 1 (no en 0). Detalle del Konami que muchos
        // implementan mal.
        progreso = tecla === SECUENCIA[0] ? 1 : 0;
      }
    }

    window.addEventListener("keydown", manejarTecla);
    return () => window.removeEventListener("keydown", manejarTecla);
  }, [aviso]);

  // Una vez abierto: click o tecla lo cierra. Y si nadie hace nada,
  // se va solo a los 6s (más que antes, porque ahora hay frase para leer).
  useEffect(() => {
    if (!activo) return;
    const cerrar = () => setActivo(false);
    const id = window.setTimeout(cerrar, 6000);
    window.addEventListener("click", cerrar);
    window.addEventListener("keydown", cerrar);
    return () => {
      clearTimeout(id);
      window.removeEventListener("click", cerrar);
      window.removeEventListener("keydown", cerrar);
    };
  }, [activo]);

  return (
    <AnimatePresence>
      {activo && (
        <motion.div
          key="portal-eg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-auto fixed inset-0 z-[80] flex flex-col items-center justify-center bg-espacio/80 backdrop-blur-md"
          aria-live="polite"
        >
          {/* Portal real: círculo verde con feTurbulence + feDisplacement
              animado vía <animate>. Lo hace el navegador en GPU, no
              cuesta JS y se siente líquido. */}
          <motion.svg
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: [0, 1.15, 1], rotate: [180, 720], opacity: 1 }}
            exit={{ scale: 0, opacity: 0, rotate: 360 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            viewBox="0 0 200 200"
            width="min(60vw, 520px)"
            height="min(60vw, 520px)"
            style={{ willChange: "transform, opacity", filter: "drop-shadow(0 0 60px rgba(151,206,76,0.8))" }}
            aria-hidden="true"
          >
            <defs>
              <filter id="liquido-portal" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="7">
                  <animate attributeName="baseFrequency" dur="6s" values="0.015;0.04;0.015" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" scale="22" />
              </filter>
              <radialGradient id="verde-portal" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d4ff86" />
                <stop offset="35%" stopColor="#97ce4c" />
                <stop offset="75%" stopColor="#4f8a2c" />
                <stop offset="100%" stopColor="#0b0d1f" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="url(#verde-portal)" filter="url(#liquido-portal)" />
            <circle
              cx="100"
              cy="100"
              r="78"
              fill="none"
              stroke="#97ce4c"
              strokeWidth="0.8"
              strokeOpacity="0.4"
              filter="url(#liquido-portal)"
            />
          </motion.svg>

          {/* Bocadillo de Rick. Spring desde abajo, estilo cómic.
              Pico hecho con dos triángulos CSS (gratis, sin SVG). */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.6 }}
            className="relative mt-8 max-w-md rounded-2xl border-2 border-portal bg-papel px-6 py-4 text-espacio shadow-[0_0_40px_rgba(151,206,76,0.5)]"
            style={{ willChange: "transform, opacity" }}
          >
            <p className="tipo-display text-lg leading-snug">"{frase}"</p>
            <p className="tipo-mono mt-2 text-[10px] uppercase tracking-widest text-espacio/60">
              — Rick Sanchez, dimensión desconocida
            </p>
            <span
              aria-hidden="true"
              className="absolute -top-3 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[12px] border-b-[14px] border-x-transparent border-b-portal"
            />
            <span
              aria-hidden="true"
              className="absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[10px] border-b-[12px] border-x-transparent border-b-papel"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
