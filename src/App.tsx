// Esqueleto de rutas. Cada página entra por lazy() así la home no se
// trae el editor ni html-to-image hasta que el usuario pisa /taller.
import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Encabezado from "./componentes/Encabezado";
import Pie from "./componentes/Pie";
import FondoEspacial from "./componentes/FondoEspacial";
import { ToastProvider } from "./componentes/Toast";
import EasterEggPortal from "./componentes/EasterEggPortal";

// Inicio va eager: es la primera pantalla, no tiene sentido diferirla.
import Inicio from "./paginas/Inicio";

const Galeria = lazy(() => import("./paginas/Galeria"));
const Taller = lazy(() => import("./paginas/Taller"));
const SobreNosotros = lazy(() => import("./paginas/SobreNosotros"));
const Contacto = lazy(() => import("./paginas/Contacto"));
const NoEncontrado = lazy(() => import("./paginas/NoEncontrado"));

function CargandoChunk() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20" aria-busy="true">
      <div className="esqueleto-shimmer h-8 w-64 rounded" />
      <div className="esqueleto-shimmer mt-4 h-4 w-96 rounded" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="esqueleto-shimmer aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  // La ubicación va como key del <Routes> para que AnimatePresence
  // tome cada cambio de ruta como un mount/unmount y anime la salida.
  const ubicacion = useLocation();

  // Pista para el que abre DevTools: tira el Konami y abre el portal.
  // Lo tiro una sola vez al montar el árbol; en StrictMode dev sale
  // dos veces y no me preocupa, es sólo desarrollo.
  useEffect(() => {
    console.log(
      "%c¿Aburrido? Probá el código de los 30 vidas de Contra…",
      "color:#97ce4c;font-size:14px;font-weight:bold;text-shadow:0 0 6px rgba(151,206,76,0.6);font-family:monospace;"
    );
    console.log(
      "%c↑ ↑ ↓ ↓ ← → ← → B A",
      "color:#d4ff86;font-size:12px;font-family:monospace;letter-spacing:4px;"
    );
  }, []);

  return (
    <ToastProvider>
      {/* Skip link: invisible hasta que recibe Tab. Sale gratis y le
          ahorra 4 tabs al que navega con teclado. */}
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>

      <div className="relative flex min-h-dvh flex-col overflow-x-hidden">
        <FondoEspacial />
        <Encabezado />

        <main id="contenido" className="relative z-10 flex-1" tabIndex={-1}>
          <Suspense fallback={<CargandoChunk />}>
            <AnimatePresence mode="wait">
              <Routes location={ubicacion} key={ubicacion.pathname}>
                <Route path="/" element={<Inicio />} />
                <Route path="/galeria" element={<Galeria />} />
                <Route path="/taller" element={<Taller />} />
                <Route path="/nosotros" element={<SobreNosotros />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="*" element={<NoEncontrado />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>

        <Pie />

        {/* Konami code → portal verde a pantalla completa. */}
        <EasterEggPortal />
      </div>
    </ToastProvider>
  );
}
