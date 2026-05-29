// Easter egg con el Konami clásico: ↑ ↑ ↓ ↓ ← → ← → B A → portal verde
// a pantalla completa. Está en su propio componente así el listener
// vive sólo cuando hace falta; cuando el portal se cierra, se desmonta.
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

export default function EasterEggPortal() {
  const [activo, setActivo] = useState(false);
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
          setActivo(true);
          aviso("Portal abierto. Bienvenido a la C-137, Morty.", { tipo: "ok", duracion: 5000 });
          progreso = 0;
        }
      } else {
        progreso = tecla === SECUENCIA[0] ? 1 : 0;
      }
    }

    window.addEventListener("keydown", manejarTecla);
    return () => window.removeEventListener("keydown", manejarTecla);
  }, [aviso]);

  // Una vez abierto, cualquier click o tecla lo cierra. Y si nadie
  // toca nada, se cierra solo a los 4.5s.
  useEffect(() => {
    if (!activo) return;
    const cerrar = () => setActivo(false);
    const id = window.setTimeout(cerrar, 4500);
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
          className="pointer-events-auto fixed inset-0 z-[80] flex items-center justify-center bg-espacio/70 backdrop-blur-sm"
          aria-hidden="true"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: [0, 1.15, 1], rotate: [180, 720] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "min(60vw, 600px)",
              height: "min(60vw, 600px)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 50% 50%, #97ce4c 0%, #4f8a2c 30%, #44318d 70%, transparent 100%)",
              boxShadow:
                "0 0 100px 30px rgba(151,206,76,0.8), inset 0 0 80px rgba(11,13,31,0.6)",
              willChange: "transform, opacity",
            }}
          />
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="tipo-display absolute bottom-20 text-2xl text-portal drop-shadow-[0_0_12px_rgba(151,206,76,0.8)]"
          >
            ¡Encontraste el secreto, Morty!
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
