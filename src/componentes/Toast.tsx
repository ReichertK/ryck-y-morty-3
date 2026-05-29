// Sistema de toasts propio. Antes había probado react-hot-toast pero
// me sumaba ~15KB para algo que se resuelve en 60 líneas, así que lo
// armé a mano con Context + AnimatePresence.
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

type Tipo = "ok" | "info" | "error";

type Toast = {
  id: string;
  texto: string;
  tipo: Tipo;
};

type ContextValor = {
  aviso: (texto: string, opciones?: { tipo?: Tipo; duracion?: number }) => void;
};

const ToastContext = createContext<ContextValor | null>(null);

const ESTILOS: Record<Tipo, { borde: string; bg: string; texto: string; Icono: typeof Info }> = {
  ok:    { borde: "border-portal/60",  bg: "bg-portal/10",  texto: "text-portal",  Icono: CheckCircle2 },
  info:  { borde: "border-cosmos-2/60", bg: "bg-cosmos/10",  texto: "text-papel",   Icono: Info },
  error: { borde: "border-sello/60",   bg: "bg-sello/10",   texto: "text-sello",   Icono: AlertTriangle },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Guardo los timers en una ref así puedo cancelarlos cuando el
  // usuario cierra antes de tiempo; si no, queda un setTimeout zombi
  // tratando de quitar un toast que ya no está.
  const timers = useRef<Map<string, number>>(new Map());

  const cerrar = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    const tid = timers.current.get(id);
    if (tid !== undefined) {
      clearTimeout(tid);
      timers.current.delete(id);
    }
  }, []);

  const aviso = useCallback<ContextValor["aviso"]>(
    (texto, opciones) => {
      const id = crypto.randomUUID();
      const tipo = opciones?.tipo ?? "info";
      const duracion = opciones?.duracion ?? 3500;
      setToasts((t) => [...t, { id, texto, tipo }]);
      const tid = window.setTimeout(() => cerrar(id), duracion);
      timers.current.set(id, tid);
    },
    [cerrar]
  );

  const valor = useMemo(() => ({ aviso }), [aviso]);

  return (
    <ToastContext.Provider value={valor}>
      {children}
      {/* aria-live polite: los lectores de pantalla anuncian el toast
          sin interrumpir lo que estén leyendo. */}
      <div
        role="region"
        aria-live="polite"
        aria-label="Notificaciones"
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col-reverse gap-2"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const { borde, bg, texto, Icono } = ESTILOS[t.tipo];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.18 } }}
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
                className={[
                  "pointer-events-auto flex max-w-sm items-start gap-2 rounded-lg border bg-espacio-2/95 px-3 py-2 shadow-postal backdrop-blur",
                  borde,
                  bg,
                ].join(" ")}
              >
                <Icono size={16} className={`mt-0.5 shrink-0 ${texto}`} aria-hidden="true" />
                <p className="text-sm leading-snug text-papel">{t.texto}</p>
                <button
                  type="button"
                  onClick={() => cerrar(t.id)}
                  aria-label="Cerrar notificación"
                  className="shrink-0 rounded p-0.5 text-papel/50 transition-colors hover:text-papel"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// Si llamás useToast() fuera del provider, fallamos ruidoso. Mejor
// romper en dev que tragarse un null y debuggear silencio después.
export function useToast(): ContextValor {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast tiene que estar adentro de <ToastProvider>");
  }
  return ctx;
}
