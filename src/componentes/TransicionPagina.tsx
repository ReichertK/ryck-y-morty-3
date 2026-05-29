// Wrapper de transición entre páginas. Sólo transform + opacity para
// que la GPU se haga cargo y la CPU descanse. Si el usuario tiene
// reduced-motion activado, no animamos: la accesibilidad gana siempre.
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = { children: ReactNode };

export default function TransicionPagina({ children }: Props) {
  const reducirMov = useReducedMotion();

  if (reducirMov) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      // Spring con un scale chiquito: queda esa sensación de "zoom" sin
      // marearle la cabeza al usuario.
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.99 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 26,
        mass: 0.6,
      }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
