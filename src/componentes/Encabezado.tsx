// Header con marca + nav. El pill activo es un solo nodo que viaja con
// layoutId entre los <NavLink>: Framer interpola la posición por nosotros
// y queda esa animación tipo Vercel/Linear sin pelearnos con el DOM.
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";

const ENLACES = [
  { a: "/", texto: "Inicio" },
  { a: "/galeria", texto: "Galería" },
  { a: "/taller", texto: "Taller" },
  { a: "/nosotros", texto: "Nosotros" },
  { a: "/contacto", texto: "Contacto" },
];

export default function Encabezado() {
  const [abierto, setAbierto] = useState(false);
  const ubicacion = useLocation();
  const reducirMov = useReducedMotion();

  // Si navegamos a otra ruta y el menú mobile quedó abierto, lo cerramos
  // solos. Nada peor que cambiar de página y tener el sandwich tapándola.
  useEffect(() => setAbierto(false), [ubicacion.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-portal/20 bg-espacio/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Marca */}
        <NavLink to="/" className="group flex items-center gap-3" aria-label="Inicio">
          <motion.span
            className="tipo-mono grid h-11 w-11 place-items-center rounded-full bg-portal text-espacio shadow-resplandor"
            aria-hidden="true"
            initial={{ rotate: -6 }}
            whileHover={reducirMov ? undefined : { rotate: 360, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
          >
            C137
          </motion.span>
          <span className="flex flex-col leading-none">
            <span className="tipo-display text-xl text-papel">
              Imprenta C-137
            </span>
            <span className="tipo-mono text-[10px] text-portal">
              Tarjetas del multiverso
            </span>
          </span>
        </NavLink>

        {/* Menú desktop */}
        <nav className="hidden md:block" aria-label="Menú principal">
          <ul className="flex items-center gap-1">
            {ENLACES.map((enlace) => {
              const activo =
                enlace.a === "/"
                  ? ubicacion.pathname === "/"
                  : ubicacion.pathname.startsWith(enlace.a);
              return (
                <li key={enlace.a} className="relative">
                  <NavLink
                    to={enlace.a}
                    end={enlace.a === "/"}
                    className={[
                      "tipo-mono relative inline-block rounded-md px-3 py-1.5 text-xs transition-colors",
                      activo ? "text-portal" : "text-papel/80 hover:text-papel",
                    ].join(" ")}
                  >
                    {/* layoutId compartido entre links → Framer Motion
                        anima el desplazamiento solo. Magia gratis. */}
                    {activo && !reducirMov && (
                      <motion.span
                        layoutId="indicador-nav"
                        className="absolute inset-0 -z-10 rounded-md border border-portal bg-portal/10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {activo && reducirMov && (
                      <span className="absolute inset-0 -z-10 rounded-md border border-portal bg-portal/10" />
                    )}
                    {enlace.texto}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Botón hamburguesa solo en mobile */}
        <motion.button
          type="button"
          className="md:hidden rounded-md border border-papel/30 p-2 text-papel"
          aria-expanded={abierto}
          aria-controls="menu-mobile"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setAbierto((v) => !v)}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ rotate: abierto ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {abierto ? <X size={18} /> : <Menu size={18} />}
          </motion.div>
        </motion.button>
      </div>

      {/* Panel mobile con AnimatePresence */}
      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div
            id="menu-mobile"
            key="menu-mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden overflow-hidden border-t border-portal/20"
          >
            <ul className="flex flex-col px-4 py-3">
              {ENLACES.map((enlace) => (
                <li key={enlace.a}>
                  <NavLink
                    to={enlace.a}
                    end={enlace.a === "/"}
                    className={({ isActive }) =>
                      [
                        "tipo-mono block rounded-md px-3 py-2 text-xs transition-colors",
                        isActive
                          ? "bg-portal/10 text-portal"
                          : "text-papel/80 hover:bg-papel/5",
                      ].join(" ")
                    }
                  >
                    {enlace.texto}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
