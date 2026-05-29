// Landing del sitio. Hero kinético, tres cards con tilt 3D, los 3
// pasos del flujo y un CTA. Todo respeta prefers-reduced-motion: si
// alguien lo activó, no le mareamos la pantalla.
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import type { MouseEvent } from "react";
import TransicionPagina from "../componentes/TransicionPagina";
import Boton from "../componentes/Boton";
import { Wand2, Sparkles, Image as ImageIcon, ArrowRight, Zap, Palette, Download } from "lucide-react";

const PALABRAS_HERO = ["Tarjetas", "del", "multiverso", "interdimensional"];

export default function Inicio() {
  const reducirMov = useReducedMotion();

  return (
    <TransicionPagina>
      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-12 md:pt-20">
        {/* Etiqueta superior con dot pulsante */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-portal/40 bg-portal/5 px-3 py-1 backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-portal opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-portal" />
          </span>
          <span className="tipo-mono text-[10px] uppercase tracking-wider text-portal">
            Imprenta C-137 · dimensión activa
          </span>
        </motion.div>

        {/* Título kinético: cada palabra entra con stagger desde abajo */}
        <h1 className="tipo-display text-5xl leading-[1.05] md:text-7xl lg:text-8xl">
          <span className="block text-papel/90">Diseñá</span>
          <span className="block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {PALABRAS_HERO.map((palabra, i) => (
                <motion.span
                  key={palabra}
                  className={[
                    "inline-block",
                    palabra === "multiverso" || palabra === "interdimensional"
                      ? "text-portal"
                      : "text-papel",
                  ].join(" ")}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.6 }}
                >
                  {palabra}&nbsp;
                </motion.span>
              ))}
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-6 max-w-xl text-lg text-papel/70"
        >
          Elegí tu personaje favorito de Rick &amp; Morty, sumale paleta,
          adornos y frases. Descargá un PNG listo para imprimir. Cero
          baba de pájaro, garantizado*.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.5 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Link to="/taller">
            <Boton variante="portal" tamano="lg">
              <Wand2 size={14} />
              Empezar a diseñar
              <ArrowRight size={14} />
            </Boton>
          </Link>
          <Link to="/galeria">
            <Boton variante="fantasma" tamano="lg">
              <ImageIcon size={14} />
              Ver galería
            </Boton>
          </Link>
        </motion.div>

        <p className="tipo-mono mt-4 text-[10px] text-papel/40">
          * No incluye seguro contra Cromulons enojados.
        </p>

        {/* HERO CARDS con tilt 3D */}
        <div className="mt-16 grid gap-6 md:mt-24 md:grid-cols-3">
          <TarjetaHero
            icono={<Zap size={20} />}
            titulo="Rápido"
            texto="Diseñá una tarjeta en menos de un minuto. Sin registro, sin esperas."
            color="portal"
            reducirMov={!!reducirMov}
          />
          <TarjetaHero
            icono={<Palette size={20} />}
            titulo="Personal"
            texto="Paletas, marcos, formas, adornos y frases. Hay un combo para cada dimensión."
            color="acido"
            reducirMov={!!reducirMov}
          />
          <TarjetaHero
            icono={<Download size={20} />}
            titulo="Portable"
            texto="Bajá tu tarjeta en PNG de alta resolución. Lista para imprimir o postear."
            color="cosmos"
            reducirMov={!!reducirMov}
          />
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="border-y border-portal/10 bg-espacio-2/40 py-16 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <span className="tipo-mono text-xs text-portal">3 pasos · 2 minutos</span>
            <h2 className="tipo-display mt-2 text-3xl md:text-4xl">¿Cómo va la cosa?</h2>
          </div>
          <ol className="grid gap-6 md:grid-cols-3">
            {[
              { n: "01", t: "Elegí personaje", d: "Buscá en la galería de cientos de criaturas del multiverso." },
              { n: "02", t: "Personalizá", d: "Sumá marco, paleta, adornos y una frase con onda." },
              { n: "03", t: "Descargá PNG", d: "Bajalo en alta. Compartilo, imprimilo, regalalo." },
            ].map((paso, i) => (
              <motion.li
                key={paso.n}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-lg border border-portal/20 bg-espacio/40 p-5"
              >
                <span className="tipo-mono text-3xl text-portal/40">{paso.n}</span>
                <h3 className="tipo-display mt-2 text-xl">{paso.t}</h3>
                <p className="mt-1 text-sm text-papel/70">{paso.d}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-xl border border-portal/30 bg-gradient-to-br from-cosmos/30 via-espacio-2 to-portal/20 p-10"
        >
          {/* Glow pulsante de fondo */}
          {!reducirMov && (
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-portal/20 blur-3xl"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <Sparkles className="mx-auto text-acido" />
          <h2 className="tipo-display mt-3 text-3xl md:text-4xl">
            ¿Listo para abrir tu portal?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-papel/70">
            La nave está esperando. El taller está abierto. Wubba lubba dub dub.
          </p>
          <Link to="/taller" className="mt-6 inline-block">
            <Boton variante="portal" tamano="lg">
              <Wand2 size={14} />
              Ir al taller
            </Boton>
          </Link>
        </motion.div>
      </section>
    </TransicionPagina>
  );
}

// ---- Tarjeta hero con tilt 3D --------------------------------------

function TarjetaHero({
  icono,
  titulo,
  texto,
  color,
  reducirMov,
}: {
  icono: React.ReactNode;
  titulo: string;
  texto: string;
  color: "portal" | "acido" | "cosmos";
  reducirMov: boolean;
}) {
  // Trackeo la posición del mouse normalizada [0..1] dentro de la card.
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  // [0..1] → grados [-6..6]. useTransform corre en el frame del compositor
  // así no hay JS extra por cada movimiento del mouse.
  const rotateX = useTransform(my, [0, 1], [6, -6]);
  const rotateY = useTransform(mx, [0, 1], [-6, 6]);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    if (reducirMov) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  const colorClases: Record<typeof color, string> = {
    portal: "border-portal/40 hover:border-portal text-portal",
    acido: "border-acido/40 hover:border-acido text-acido",
    cosmos: "border-cosmos-2/40 hover:border-cosmos-2 text-cosmos-2",
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={
        reducirMov
          ? undefined
          : { rotateX, rotateY, transformPerspective: 800, transformStyle: "preserve-3d" }
      }
      whileHover={reducirMov ? undefined : { scale: 1.02 }}
      transition={{ type: "spring", stiffness: 250, damping: 25 }}
      className={[
        "group relative rounded-xl border bg-espacio-2/60 p-6 backdrop-blur transition-colors",
        colorClases[color],
      ].join(" ")}
    >
      {/* Brillo sutil que aparece en hover */}
      {!reducirMov && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-current/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
      <div style={reducirMov ? undefined : { transform: "translateZ(20px)" }}>
        <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-lg bg-papel/5">
          <span>{icono}</span>
        </div>
        <h3 className="tipo-display text-2xl text-papel">{titulo}</h3>
        <p className="mt-1 text-sm text-papel/70">{texto}</p>
      </div>
    </motion.div>
  );
}
