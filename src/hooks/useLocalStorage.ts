// Hook tipo useState pero el valor sobrevive a un F5. Si localStorage
// no está disponible (modo incógnito viejo, SSR), degrada a useState
// y sigue funcionando — nunca rompemos por algo opcional.
import { useCallback, useEffect, useRef, useState } from "react";

type Inicializador<T> = T | (() => T);

export function useLocalStorage<T>(
  clave: string,
  valorInicial: Inicializador<T>
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // useState con función: la lectura del storage corre sólo en el mount.
  const [valor, setValor] = useState<T>(() => {
    try {
      const guardado = window.localStorage.getItem(clave);
      if (guardado === null) {
        return valorInicial instanceof Function ? valorInicial() : valorInicial;
      }
      return JSON.parse(guardado) as T;
    } catch {
      return valorInicial instanceof Function ? valorInicial() : valorInicial;
    }
  });

  // Esto evita escribir el primer render: el valor ya vino del storage,
  // no tiene sentido pisarlo con lo mismo y disparar el storage event.
  const primerRender = useRef(true);

  useEffect(() => {
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    try {
      window.localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      // Storage lleno o bloqueado. No es crítico: el estado en memoria
      // sigue laburando igual, sólo perdemos la persistencia.
    }
  }, [clave, valor]);

  // Si el usuario abre el taller en dos pestañas y edita en una, esto
  // refleja el cambio en la otra. Storage event slo dispara entre
  // pestañas distintas, nunca en la que escribió, así que no hay loop.
  useEffect(() => {
    function manejarStorage(ev: StorageEvent) {
      if (ev.key !== clave || ev.newValue === null) return;
      try {
        setValor(JSON.parse(ev.newValue) as T);
      } catch {
        // JSON corrupto en la otra pestaña, lo ignoramos.
      }
    }
    window.addEventListener("storage", manejarStorage);
    return () => window.removeEventListener("storage", manejarStorage);
  }, [clave]);

  return [valor, setValor];
}

// Borra una clave puntual (lo uso en el botón "Empezar de cero").
export function borrarLocalStorage(clave: string) {
  try {
    window.localStorage.removeItem(clave);
  } catch {
    // Mismo caso que arriba: si no se puede, no se puede.
  }
}

// Helper para favoritos: array persistido + toggle + check.
export function useFavoritos(clave = "c137:favoritos") {
  const [ids, setIds] = useLocalStorage<number[]>(clave, []);

  const esFavorito = useCallback((id: number) => ids.includes(id), [ids]);

  const alternarFavorito = useCallback(
    (id: number) => {
      setIds((actuales) =>
        actuales.includes(id)
          ? actuales.filter((x) => x !== id)
          : [...actuales, id]
      );
    },
    [setIds]
  );

  return { ids, esFavorito, alternarFavorito };
}
