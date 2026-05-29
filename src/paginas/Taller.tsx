// El editor principal. Layout fijo: el canvas no se va de la pantalla
// nunca y los controles scrollean a la derecha. En mobile se acomoda
// vertical con un FAB para previsualizar sin perder lo que venías
// haciendo.
//
// Además del editor clásico hay dos guiniños que le suman onda:
// Schmeckles (gamificación boba que premia jugar con la tarjeta) y
// la Caja de Meeseeks (un botón de "randomizá esto" con animación).
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Dice5,
  Save,
  RotateCcw,
  Keyboard,
  Eye,
  X,
  Sparkles,
  Coins,
} from "lucide-react";

import TransicionPagina from "../componentes/TransicionPagina";
import Boton from "../componentes/Boton";
import { useToast } from "../componentes/Toast";
import { useLocalStorage, borrarLocalStorage } from "../hooks/useLocalStorage";

import LienzoTarjeta from "../taller/LienzoTarjeta";
import ControlesTaller from "../taller/ControlesTaller";
import { descargarTarjeta } from "../taller/descargarTarjeta";
import type { EstadoTarjeta, Adorno } from "../taller/tipos";
import {
  PALETAS,
  MOTIVOS,
  DIMENSIONES,
  MINIS_PERSONAJE,
  FRASES_MEESEEKS,
} from "../taller/catalogos";
import { urlAvatar } from "../api/personajes";
import { usePersonajes } from "../hooks/usePersonajes";
import type { Personaje } from "../api/personajes";

// La clave incluye un v2 porque cambié el shape (sumé `dimension`).
// Si alguien tiene la v1 en su storage, esta key no la pisa: arranca
// limpio en vez de explotar al deserializar.
const STORAGE_KEY = "c137:taller:v2";

const TARJETA_INICIAL: EstadoTarjeta = {
  personaje: null,
  textoSuperior: "",
  textoInferior: "Con cariño",
  motivo: "¡Feliz cumpleaños!",
  marco: "polaroid",
  forma: "rectangular",
  orientacion: "vertical",
  colorFondo: PALETAS[0].fondo,
  colorTexto: PALETAS[0].texto,
  rotacionTarjeta: -2,
  adornos: [],
  dimension: "ninguna",
};

// Schmeckles: gamificación simple. Más adornos / más dimensión / más
// personaje, más puntos. No afecta la descarga, es decoración con onda.
function calcularSchmeckles(t: EstadoTarjeta) {
  const porAdornos = t.adornos.length * 3;
  const dim = DIMENSIONES.find((d) => d.id === t.dimension)?.schmeckles ?? 0;
  const porPersonaje = t.personaje ? 5 : 0;
  const porRotacion = Math.abs(t.rotacionTarjeta) > 0 ? 1 : 0;
  return porAdornos + dim + porPersonaje + porRotacion;
}

export default function Taller() {
  const ubicacion = useLocation();
  const personajeInicial = (ubicacion.state as { personaje?: Personaje } | null)
    ?.personaje;

  const [tarjeta, setTarjeta] = useLocalStorage<EstadoTarjeta>(
    STORAGE_KEY,
    TARJETA_INICIAL
  );

  const personajeAplicado = useRef(false);
  useEffect(() => {
    if (personajeInicial && !personajeAplicado.current) {
      personajeAplicado.current = true;
      setTarjeta((t) => ({ ...t, personaje: personajeInicial }));
    }
  }, [personajeInicial, setTarjeta]);

  const { aviso } = useToast();

  const [idSeleccionado, setIdSeleccionado] = useState<string | null>(null);

  // Búsqueda del selector de personaje principal (la grilla chiquita
  // del panel derecho). Debounce 300ms para no machacar la API.
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setFiltro(busqueda.trim()), 300);
    return () => clearTimeout(t);
  }, [busqueda]);
  const { personajes, cargando, error } = usePersonajes({
    pagina: 1,
    nombre: filtro || undefined,
  });

  const refLienzo = useRef<HTMLDivElement>(null);
  const [descargando, setDescargando] = useState(false);
  const [modoCaptura, setModoCaptura] = useState(false);

  // FAB de preview rápido para mobile.
  const [previewMobile, setPreviewMobile] = useState(false);

  // Mr. Meeseeks aparece, suelta una frase y se va con un poof.
  const [meeseeksVisible, setMeeseeksVisible] = useState(false);
  const [meeseeksFrase, setMeeseeksFrase] = useState("");

  const schmeckles = useMemo(() => calcularSchmeckles(tarjeta), [tarjeta]);

  const actualizarAdorno = useCallback(
    (id: string, cambios: Partial<Adorno>) => {
      setTarjeta((t) => ({
        ...t,
        adornos: t.adornos.map((a) => (a.id === id ? { ...a, ...cambios } : a)),
      }));
    },
    [setTarjeta]
  );

  const borrarAdornoActual = useCallback(() => {
    if (!idSeleccionado) return;
    setTarjeta((t) => ({
      ...t,
      adornos: t.adornos.filter((a) => a.id !== idSeleccionado),
    }));
    setIdSeleccionado(null);
    aviso("Adorno fuera del multiverso.", { tipo: "info", duracion: 1800 });
  }, [idSeleccionado, setTarjeta, aviso]);

  const bajarPNG = useCallback(async () => {
    if (!refLienzo.current) return;
    setDescargando(true);
    setModoCaptura(true);
    // Dos rAF seguidos: dan tiempo a que React aplique el `modoCaptura`
    // (esconde handles) y el navegador haga el repaint antes de que
    // html-to-image lea el DOM. Sin esto a veces capturaba los outlines.
    await new Promise<void>((res) =>
      requestAnimationFrame(() => requestAnimationFrame(() => res()))
    );
    try {
      const nombre = tarjeta.personaje
        ? `tarjeta-${tarjeta.personaje.name.toLowerCase().replace(/\s+/g, "-")}.png`
        : "tarjeta-c137.png";
      await descargarTarjeta(refLienzo.current, nombre);
      aviso("¡Tarjeta lista! Fijáte en Descargas.", {
        tipo: "ok",
      });
    } catch (err) {
      console.error("No pude generar el PNG:", err);
      aviso("Se rompió algo generando la imagen. Probá de nuevo en un toque.", {
        tipo: "error",
      });
    } finally {
      setModoCaptura(false);
      setDescargando(false);
    }
  }, [tarjeta.personaje, aviso]);

  function sorprenderme() {
    const paleta = PALETAS[Math.floor(Math.random() * PALETAS.length)];
    const motivo = MOTIVOS[Math.floor(Math.random() * MOTIVOS.length)].texto;
    setTarjeta((t) => ({
      ...t,
      colorFondo: paleta.fondo,
      colorTexto: paleta.texto,
      motivo,
      rotacionTarjeta: Math.floor(Math.random() * 9) - 4,
    }));
    aviso(`Paleta nueva: ${paleta.nombre}.`, { tipo: "info", duracion: 1800 });
  }

  function empezarDeCero() {
    if (!window.confirm("¿Arrancar de cero? Se va todo lo que hiciste.")) return;
    borrarLocalStorage(STORAGE_KEY);
    setTarjeta(TARJETA_INICIAL);
    setIdSeleccionado(null);
    aviso("Listo, lienzo en blanco.", { tipo: "ok", duracion: 1800 });
  }

  // Invoca al Sr. Meeseeks: randomiza paleta + dimensión + suma un
  // sticker random + suelta una frase del personaje. Vive 2.4s y poof.
  function invocarMeeseeks() {
    const paleta = PALETAS[Math.floor(Math.random() * PALETAS.length)];
    // Saco "ninguna" del pool: si voy a invocar caos, que sea caos.
    const dimsLocas = DIMENSIONES.filter((d) => d.id !== "ninguna");
    const dim = dimsLocas[Math.floor(Math.random() * dimsLocas.length)];
    const mini =
      MINIS_PERSONAJE[Math.floor(Math.random() * MINIS_PERSONAJE.length)];
    const frase =
      FRASES_MEESEEKS[Math.floor(Math.random() * FRASES_MEESEEKS.length)];

    setTarjeta((t) => ({
      ...t,
      colorFondo: paleta.fondo,
      colorTexto: paleta.texto,
      dimension: dim.id,
      adornos: [
        ...t.adornos,
        {
          id: crypto.randomUUID(),
          tipo: "imagen",
          urlImagen: urlAvatar(mini.id),
          etiqueta: mini.nombre,
          x: 30 + Math.random() * 40,
          y: 30 + Math.random() * 40,
          tamano: 70,
          rotacion: Math.floor(Math.random() * 30) - 15,
        },
      ],
    }));

    setMeeseeksFrase(frase);
    setMeeseeksVisible(true);
    aviso(frase, { tipo: "info", duracion: 3500 });

    // El Meeseeks vive 2.4s y desaparece con humito.
    window.setTimeout(() => setMeeseeksVisible(false), 2400);
  }

  // Atajos de teclado del editor.
  useEffect(() => {
    function manejar(ev: KeyboardEvent) {
      const t = ev.target as HTMLElement | null;
      const escribiendo =
        t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);

      if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "d") {
        ev.preventDefault();
        bajarPNG();
        return;
      }

      if (escribiendo) return;

      if (ev.key === "Escape") {
        setIdSeleccionado(null);
        setPreviewMobile(false);
        return;
      }

      if (!idSeleccionado) return;

      if (ev.key === "Delete" || ev.key === "Backspace") {
        ev.preventDefault();
        borrarAdornoActual();
        return;
      }

      const delta = ev.shiftKey ? 5 : 1;
      const movimientos: Record<string, [number, number]> = {
        ArrowLeft: [-delta, 0],
        ArrowRight: [delta, 0],
        ArrowUp: [0, -delta],
        ArrowDown: [0, delta],
      };
      const mov = movimientos[ev.key];
      if (mov) {
        ev.preventDefault();
        const actual = tarjeta.adornos.find((a) => a.id === idSeleccionado);
        if (!actual) return;
        actualizarAdorno(idSeleccionado, {
          x: Math.max(0, Math.min(100, actual.x + mov[0])),
          y: Math.max(0, Math.min(100, actual.y + mov[1])),
        });
      }
    }

    window.addEventListener("keydown", manejar);
    return () => window.removeEventListener("keydown", manejar);
  }, [idSeleccionado, tarjeta.adornos, actualizarAdorno, borrarAdornoActual, bajarPNG]);

  // ---- Auto-escala del lienzo --------------------------------------
  // El canvas tiene tamaño lógico fijo (480×640 o 640×480). Para que
  // siempre entre entero en la columna izquierda sin scroll, calculo
  // un factor con ResizeObserver y lo aplico al wrapper con scale().
  // Truco clave: el transform vive en un nodo PADRE del refLienzo,
  // así html-to-image captura el DOM original a tamaño real y el PNG
  // sale al 100% sin importar cuánto se vea achicado en pantalla.
  const refContenedorCanvas = useRef<HTMLDivElement>(null);
  const [escalaCanvas, setEscalaCanvas] = useState(1);
  useEffect(() => {
    const cont = refContenedorCanvas.current;
    if (!cont) return;
    function recalcular() {
      if (!cont) return;
      const w = tarjeta.orientacion === "horizontal" ? 640 : 480;
      const h = tarjeta.orientacion === "horizontal" ? 480 : 640;
      // Margen interno así la sombra/rotación del marco no se recortan.
      const dispAncho = Math.max(0, cont.clientWidth - 40);
      const dispAlto = Math.max(0, cont.clientHeight - 40);
      const factor = Math.min(1, Math.min(dispAncho / w, dispAlto / h));
      setEscalaCanvas(factor || 1);
    }
    recalcular();
    const obs = new ResizeObserver(recalcular);
    obs.observe(cont);
    return () => obs.disconnect();
  }, [tarjeta.orientacion]);

  // Render del bloque lienzo + badge + hint.
  // El modal mobile lo reusa pero pasando undefined como ref: dos refs
  // apuntando al mismo nodo le hacen explotar la cabeza a html-to-image.
  function renderLienzoEscalado(
    refLocal: React.Ref<HTMLDivElement> | undefined,
    aplicarEscala: boolean
  ) {
    return (
      <div
        ref={aplicarEscala ? refContenedorCanvas : undefined}
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
      >
        {/* Wrapper que aplica el scale; el origin centrado mantiene la
            tarjeta visualmente equilibrada al cambiar de tamaño. */}
        <div
          style={{
            transform: aplicarEscala ? `scale(${escalaCanvas})` : undefined,
            transformOrigin: "center center",
            transition: "transform 0.2s ease",
          }}
        >
          <LienzoTarjeta
            ref={refLocal}
            tarjeta={tarjeta}
            idSeleccionado={idSeleccionado}
            onSeleccionar={setIdSeleccionado}
            onActualizarAdorno={actualizarAdorno}
            modoCaptura={modoCaptura}
          />
        </div>

        {/* Badge Schmeckles. Vive fuera del refLienzo así no se cuela
            en el PNG cuando se descarga. */}
        <motion.div
          key={schmeckles}
          initial={{ scale: 0.85, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-acido/60 bg-espacio/85 px-3 py-1 backdrop-blur"
          title="Schmeckles ganados con esta tarjeta"
        >
          <Coins size={12} className="text-acido" />
          <span className="tipo-mono text-[11px] font-bold text-acido">
            {schmeckles}
          </span>
          <span className="tipo-mono text-[9px] text-papel/70">Schmeckles</span>
        </motion.div>

        {/* Recordatorio de atajos: aparece sólo cuando hay algo seleccionado. */}
        <AnimatePresence>
          {idSeleccionado && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="pointer-events-none absolute bottom-3 left-1/2 flex max-w-[95%] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-md border border-portal/30 bg-espacio/85 px-3 py-1.5 text-[10px] text-papel/80 backdrop-blur"
            >
              <Keyboard size={11} className="text-portal" />
              <span><kbd className="tecla-tip">←↑↓→</kbd> mover</span>
              <span><kbd className="tecla-tip">Shift</kbd>+flechas 5%</span>
              <span><kbd className="tecla-tip">Del</kbd> borrar</span>
              <span><kbd className="tecla-tip">Esc</kbd> deseleccionar</span>
              <span><kbd className="tecla-tip">Ctrl</kbd>+<kbd className="tecla-tip">D</kbd> descargar</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Selector de personaje. Lo armé como sub-render porque ahora vive
  // en la sidebar y la idea era no inflar el JSX principal.
  function renderSelectorPersonaje() {
    return (
      <div className="rounded-lg border border-portal/20 bg-espacio-2/60 p-3 backdrop-blur">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="tipo-mono text-[10px] text-portal">
            Personaje principal
          </h2>
          <input
            type="search"
            placeholder="Buscar…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar personaje"
            className="w-32 rounded-md border border-papel/20 bg-espacio/60 px-2 py-1 text-[11px] text-papel placeholder:text-papel/40 focus:border-portal focus:outline-none"
          />
        </div>

        {cargando && (
          <ul className="grid grid-cols-6 gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="esqueleto-shimmer aspect-square rounded-md" />
            ))}
          </ul>
        )}
        {error && <p className="tipo-mono text-[10px] text-sello">{error}</p>}
        {!cargando && personajes.length > 0 && (
          <ul className="grid grid-cols-6 gap-1.5">
            {personajes.slice(0, 12).map((p) => {
              const elegido = tarjeta.personaje?.id === p.id;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setTarjeta((t) => ({ ...t, personaje: p }));
                      aviso(`Listo, llegó ${p.name}.`, { tipo: "ok", duracion: 1400 });
                    }}
                    aria-pressed={elegido}
                    title={p.name}
                    className={[
                      "block w-full overflow-hidden rounded-md border transition-all",
                      elegido
                        ? "border-portal ring-2 ring-portal/50"
                        : "border-papel/20 hover:scale-105 hover:border-portal/50",
                    ].join(" ")}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {!cargando && personajes.length === 0 && (
          <p className="tipo-mono text-[10px] text-papel/60">
            Cero match. Probá con otra dimensión (o revisá cómo se escribe).
          </p>
        )}
      </div>
    );
  }

  return (
    <TransicionPagina>
      {/* Layout: canvas fijo + sidebar scrolleable.
          - <lg flujo vertical normal con FAB de preview.
          - >=lg la section ocupa viewport menos el header; el canvas
            queda quieto (sin scroll) y los controles tienen su propio
            overflow a la derecha. */}
      <section className="flex flex-col lg:h-[calc(100dvh-4.5rem)] lg:overflow-hidden">
        {/* Header del taller — compacto en desktop */}
        <header className="shrink-0 border-b border-portal/10 bg-espacio/60 px-4 py-3 backdrop-blur lg:px-6">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="tipo-mono text-[10px] text-portal">El taller</span>
              <h1 className="tipo-display text-2xl leading-none md:text-3xl">
                Armá tu tarjeta
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Boton variante="fantasma" tamano="sm" onClick={empezarDeCero} title="Borrar todo y empezar de cero">
                <RotateCcw size={12} />
                Reset
              </Boton>
              <Boton
                variante="cosmos"
                tamano="sm"
                onClick={invocarMeeseeks}
                title="Caja de Meeseeks: randomiza paleta, dimensión y suma un sticker"
              >
                <Sparkles size={12} />
                ¡Ayuda Meeseeks!
              </Boton>
              <Boton variante="cosmos" tamano="sm" onClick={sorprenderme}>
                <Dice5 size={12} />
                Remix
              </Boton>
              <Boton
                variante="portal"
                tamano="sm"
                onClick={bajarPNG}
                disabled={descargando}
                cargando={descargando}
              >
                {descargando ? <Save size={12} /> : <Download size={12} />}
                {descargando ? "Empaquetando…" : "Descargar PNG"}
              </Boton>
            </div>
          </div>
        </header>

        {/* Body: en desktop divide canvas + sidebar; en mobile cae uno arriba del otro. */}
        <div className="flex flex-1 flex-col lg:min-h-0 lg:flex-row">
          {/* Columna izquierda: canvas fijo. */}
          <div className="relative flex min-h-[60vh] flex-1 items-center justify-center bg-transparent p-4 lg:h-full lg:min-h-0 lg:overflow-hidden lg:p-6">
            {renderLienzoEscalado(refLienzo, true)}
          </div>

          {/* Columna derecha: panel de herramientas scrolleable. */}
          <aside
            className="custom-scrollbar w-full border-portal/20 bg-espacio-2/40 backdrop-blur lg:h-full lg:w-[450px] lg:shrink-0 lg:overflow-y-auto lg:border-l"
            aria-label="Panel de herramientas"
          >
            <div className="space-y-5 p-4 lg:p-5">
              {renderSelectorPersonaje()}
              <ControlesTaller
                tarjeta={tarjeta}
                setTarjeta={setTarjeta}
                idSeleccionado={idSeleccionado}
                setIdSeleccionado={setIdSeleccionado}
              />
            </div>
          </aside>
        </div>
      </section>

      {/* FAB de preview rápido para mobile. */}
      <motion.button
        type="button"
        onClick={() => setPreviewMobile(true)}
        aria-label="Previsualizar tarjeta"
        className="boton-tactil fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full border-2 border-portal bg-portal text-espacio shadow-resplandor lg:hidden"
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" } }}
      >
        <Eye size={20} />
      </motion.button>

      {/* Modal preview mobile */}
      <AnimatePresence>
        {previewMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-espacio/85 p-4 backdrop-blur-md lg:hidden"
            onClick={() => setPreviewMobile(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 24 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-md overflow-hidden rounded-xl border border-portal/40 bg-espacio-2 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="tipo-mono text-xs text-portal">Vista previa</h2>
                <button
                  type="button"
                  onClick={() => setPreviewMobile(false)}
                  aria-label="Cerrar preview"
                  className="rounded-md p-1 text-papel/60 hover:bg-papel/10 hover:text-papel"
                >
                  <X size={16} />
                </button>
              </div>
              {/* Sin ref acá: el refLienzo "real" vive en el panel
                  principal y html-to-image se confunde si hay dos. */}
              <div className="h-[60vh]">{renderLienzoEscalado(undefined, true)}</div>
              <p className="tipo-mono mt-3 text-center text-[10px] text-papel/50">
                Tocá afuera para volver a editar.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mr. Meeseeks: aparece, suelta su frase y se va con humito. */}
      <AnimatePresence>
        {meeseeksVisible && (
          <motion.div
            key="meeseeks"
            initial={{ opacity: 0, scale: 0.4, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: -80, filter: "blur(8px)" }}
            transition={{ type: "spring", stiffness: 280, damping: 18 }}
            className="pointer-events-none fixed bottom-24 left-1/2 z-[70] -translate-x-1/2"
            aria-hidden="true"
          >
            <div className="flex flex-col items-center">
              <div className="relative mb-2 max-w-[260px] rounded-2xl border-2 border-acido bg-papel px-4 py-2 text-tinta shadow-2xl">
                <p className="tipo-mono text-center text-[11px] leading-snug">
                  {meeseeksFrase}
                </p>
                <span className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-acido bg-papel" />
              </div>
              <motion.svg
                width="120"
                height="150"
                viewBox="0 0 120 150"
                animate={{ rotate: [-4, 4, -4] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <defs>
                  <radialGradient id="meeseeks-skin" cx="0.5" cy="0.4" r="0.6">
                    <stop offset="0%" stopColor="#9be5ef" />
                    <stop offset="100%" stopColor="#39b8c6" />
                  </radialGradient>
                </defs>
                <ellipse cx="60" cy="55" rx="48" ry="50" fill="url(#meeseeks-skin)" stroke="#1c2733" strokeWidth="3" />
                <rect x="38" y="100" width="44" height="40" rx="8" fill="#39b8c6" stroke="#1c2733" strokeWidth="3" />
                <circle cx="44" cy="50" r="14" fill="white" stroke="#1c2733" strokeWidth="2.5" />
                <circle cx="76" cy="50" r="14" fill="white" stroke="#1c2733" strokeWidth="2.5" />
                <circle cx="44" cy="52" r="4" fill="#1c2733" />
                <circle cx="76" cy="52" r="4" fill="#1c2733" />
                <path d="M 38 75 Q 60 95 82 75" stroke="#1c2733" strokeWidth="3" fill="#5a1a1a" strokeLinecap="round" />
                <line x1="50" y1="80" x2="50" y2="86" stroke="#1c2733" strokeWidth="2" />
                <line x1="60" y1="83" x2="60" y2="90" stroke="#1c2733" strokeWidth="2" />
                <line x1="70" y1="80" x2="70" y2="86" stroke="#1c2733" strokeWidth="2" />
              </motion.svg>
              <motion.div
                className="-mt-4 flex gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0, scale: 1.8 }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="h-3 w-3 rounded-full bg-papel/70 blur-sm"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TransicionPagina>
  );
}
