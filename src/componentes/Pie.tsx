// Pie de página. Mantiene la onda postal del proyecto original pero con
// la paleta espacial. Cada visita arranca con una cita random del show.
import { useEffect, useMemo, useRef, useState } from "react";

// Citas neutras (mezcla de doblaje + traducciones que ya circulan).
// Las elijo random una sola vez por montaje así quedan fijas mientras
// el usuario navega.
const CITAS = [
  {
    texto: "Wubba lubba dub dub.",
    autor: "Rick (cuando finge estar bien)",
  },
  {
    texto: "¡Soy el Sr. Meeseeks, mírame!",
    autor: "Sr. Meeseeks (existir es dolor)",
  },
  {
    texto: "Nadie se da cuenta de que existo… ohhh.",
    autor: "Sr. Poopybutthole",
  },
  {
    texto: "Show me what you got!",
    autor: "Cromulón (no lo decepciones)",
  },
  {
    texto: "Pickle Riiiiiiick.",
    autor: "Un pepino con problemas",
  },
  {
    texto: "Tu opinión significa muy poco para mí.",
    autor: "Rick a Jerry, probablemente",
  },
  {
    texto: "Existir es elegir, y elegir es perder.",
    autor: "Birdperson (filósofo accidental)",
  },
  {
    texto: "Squanch squanch squanchy squanch.",
    autor: "Squanchy (traducir bajo el squanch propio)",
  },
  {
    texto: "El amor es una reacción química que obliga a los animales a reproducirse.",
    autor: "Rick, cínico full",
  },
  {
    texto: "Estamos hechos de la misma cosa que las estrellas. Y de pepinillos.",
    autor: "Imprenta C-137",
  },
];

export default function Pie() {
  const anio = new Date().getFullYear();
  // useMemo con deps vacías: pickeamos una sola vez al montar y listo.
  const cita = useMemo(
    () => CITAS[Math.floor(Math.random() * CITAS.length)],
    []
  );

  // Pista visual: si dejan el mouse sobre el copyright 3s, el texto
  // arranca con un glitch sutil y el cursor cambia a "help". Es una
  // señal de que hay algo escondido por ahí. Uso ref para el timer así
  // no se reinicia con re-renders.
  const [glitch, setGlitch] = useState(false);
  const refTimer = useRef<number | null>(null);

  function arrancarHover() {
    if (refTimer.current) return;
    refTimer.current = window.setTimeout(() => setGlitch(true), 3000);
  }
  function cortarHover() {
    if (refTimer.current) {
      clearTimeout(refTimer.current);
      refTimer.current = null;
    }
    setGlitch(false);
  }
  useEffect(() => () => { if (refTimer.current) clearTimeout(refTimer.current); }, []);

  return (
    <footer className="relative z-10 mt-16 border-t border-portal/20 bg-espacio-2/60 backdrop-blur">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
        <div>
          <h3 className="tipo-mono text-xs text-portal">Mensaje del día</h3>
          <blockquote className="mt-3 rounded-md border border-portal/20 bg-espacio/40 p-4">
            <p className="tipo-display text-xl leading-tight text-papel">
              "{cita.texto}"
            </p>
            <footer className="tipo-mono mt-2 text-[10px] text-papel/50">
              — {cita.autor}
            </footer>
          </blockquote>
        </div>
        <div>
          <h3 className="tipo-mono text-xs text-portal">Remitente</h3>
          <ul className="mt-3 space-y-1 font-mono text-sm text-papel/80">
            <li>Imprenta C-137</li>
            <li>
              <a
                className="underline-offset-4 hover:text-portal hover:underline"
                href="mailto:hola@c137.lab"
              >
                hola@c137.lab
              </a>
            </li>
            <li>Dimensión C-137 · La Plata</li>
            <li className="text-papel/50">
              Atendemos cuando Rick no está borracho. (O sea, casi nunca.)
            </li>
          </ul>
        </div>
      </div>
      <p
        onMouseEnter={arrancarHover}
        onMouseLeave={cortarHover}
        className={
          "tipo-mono border-t border-papel/10 py-3 text-center text-[11px] text-papel/50 transition-colors " +
          (glitch ? "glitch-copy cursor-help text-portal/80" : "cursor-default")
        }
        data-texto={`© ${anio} Imprenta C-137 · Hecho a mano por un humano, sin templates ni IA · 100% libre de Cronenbergs`}
      >
        © {anio} Imprenta C-137 · Hecho a mano por un humano, sin templates ni IA ·
        <span className="ml-1 text-portal/70">100% libre de Cronenbergs</span>
      </p>
    </footer>
  );
}
