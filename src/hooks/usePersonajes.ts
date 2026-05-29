// Hook que envuelve el fetch a la API. El componente sólo lee
// { personajes, cargando, error } y se olvida de AbortController.
import { useEffect, useState } from "react";
import {
  traerPersonajes,
  type Personaje,
  type FiltrosPersonajes,
} from "../api/personajes";

type Estado = {
  personajes: Personaje[];
  paginas: number;
  cargando: boolean;
  error: string | null;
};

const ESTADO_INICIAL: Estado = {
  personajes: [],
  paginas: 0,
  cargando: true,
  error: null,
};

// Re-pega a la API cada vez que cambian los filtros. AbortController
// es clave acá: si el usuario escribe rápido o salta entre filtros,
// abandonamos las requests viejas así no pisan a las nuevas (clásica
// race condition que rompe la UI).
export function usePersonajes(filtros: FiltrosPersonajes): Estado {
  const [estado, setEstado] = useState<Estado>(ESTADO_INICIAL);

  // Serializo los filtros como dep porque si los paso como objeto,
  // React ve una referencia nueva en cada render y vuelve a fetchar.
  const claveFiltros = JSON.stringify(filtros);

  useEffect(() => {
    const controlador = new AbortController();

    setEstado((s) => ({ ...s, cargando: true, error: null }));

    traerPersonajes(filtros)
      .then((data) => {
        if (controlador.signal.aborted) return;
        setEstado({
          personajes: data.resultados,
          paginas: data.paginas,
          cargando: false,
          error: null,
        });
      })
      .catch((err: unknown) => {
        if (controlador.signal.aborted) return;
        // Mensaje para el usuario, no el stacktrace técnico.
        const mensaje =
          err instanceof Error ? err.message : "Algo se rompió pidiendo datos";
        setEstado({
          personajes: [],
          paginas: 0,
          cargando: false,
          error: mensaje,
        });
      });

    return () => controlador.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claveFiltros]);

  return estado;
}
