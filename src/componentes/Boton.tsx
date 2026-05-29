// Botón único del sitio. Si necesito otro estilo, sumo variante; no
// armo un componente nuevo cada vez (DRY > clever).
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

type Variante = "portal" | "cosmos" | "papel" | "fantasma" | "peligro";
type Tamano = "sm" | "md" | "lg";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<"button">> &
  HTMLMotionProps<"button"> & {
    variante?: Variante;
    tamano?: Tamano;
    cargando?: boolean;
    children: ReactNode;
  };

const ESTILOS: Record<Variante, string> = {
  portal:
    "bg-portal text-espacio hover:bg-slime border border-portal hover:shadow-resplandor",
  cosmos:
    "bg-cosmos text-papel hover:bg-cosmos-2 border border-cosmos-2",
  papel:
    "bg-papel text-tinta hover:bg-papel-2 border border-papel-2",
  fantasma:
    "bg-transparent text-papel hover:bg-papel/10 border border-papel/30",
  peligro:
    "bg-sello/20 text-sello hover:bg-sello/30 border border-sello/60",
};

const TAMANOS: Record<Tamano, string> = {
  sm: "px-3 py-1.5 text-[10px]",
  md: "px-4 py-2 text-xs",
  lg: "px-5 py-2.5 text-sm",
};

export default function Boton({
  variante = "portal",
  tamano = "md",
  cargando = false,
  disabled,
  className = "",
  children,
  ...props
}: Props) {
  return (
    <motion.button
      // Hover/tap son transform puro: cero repaint, todo lo hace la GPU.
      whileHover={!disabled && !cargando ? { scale: 1.03 } : undefined}
      whileTap={!disabled && !cargando ? { scale: 0.96 } : undefined}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      disabled={disabled || cargando}
      aria-busy={cargando || undefined}
      {...props}
      className={[
        "boton-tactil tipo-mono inline-flex items-center justify-center gap-2 rounded-md font-bold uppercase tracking-wider transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        TAMANOS[tamano],
        ESTILOS[variante],
        className,
      ].join(" ")}
    >
      {cargando && <Loader2 size={14} className="animate-spin" />}
      {children}
    </motion.button>
  );
}
