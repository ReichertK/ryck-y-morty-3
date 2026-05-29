// Barra lateral del taller: muestra los controles y delega los cambios
// al setter que le pasa el padre. Sin lógica de API ni descarga —
// es la cara visible del estado, y nada más.
import { useMemo, useState } from "react";
import type {
  EstadoTarjeta,
  Marco,
  Forma,
  Orientacion,
  Adorno,
  Dimension,
} from "./tipos";
import {
  MARCOS,
  FORMAS,
  ORIENTACIONES,
  MOTIVOS,
  TIPOS_ADORNO,
  PALETAS,
  MINIS_PERSONAJE,
  DIMENSIONES,
  FRASES_ICONICAS,
  type TipoAdorno,
} from "./catalogos";
import { ADORNOS, NOMBRE_ADORNO } from "./adornosSvg";
import { urlAvatar } from "../api/personajes";
import { Trash2, RotateCcw, ChevronUp, ChevronDown, X, Search, Sparkles, Quote } from "lucide-react";

type Props = {
  tarjeta: EstadoTarjeta;
  setTarjeta: React.Dispatch<React.SetStateAction<EstadoTarjeta>>;
  idSeleccionado: string | null;
  setIdSeleccionado: (id: string | null) => void;
};

// ---- Subcomponentes chiquitos ---------------------------------------

function Seccion({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h3 className="tipo-mono text-[10px] text-portal">{titulo}</h3>
      {children}
    </section>
  );
}

function BotonPildora({
  activo,
  children,
  onClick,
  titulo,
}: {
  activo: boolean;
  children: React.ReactNode;
  onClick: () => void;
  titulo?: string;
}) {
  return (
    <button
      type="button"
      title={titulo}
      onClick={onClick}
      className={[
        "tipo-mono rounded-md border px-2 py-1 text-[10px] transition-all",
        activo
          ? "border-portal bg-portal/20 text-portal"
          : "border-papel/20 text-papel/70 hover:border-papel/50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Slider({
  etiqueta,
  min,
  max,
  paso = 1,
  valor,
  cambio,
  sufijo = "",
}: {
  etiqueta: string;
  min: number;
  max: number;
  paso?: number;
  valor: number;
  cambio: (v: number) => void;
  sufijo?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between text-[10px] text-papel/70">
        <span className="tipo-mono">{etiqueta}</span>
        <span className="tipo-mono text-portal">
          {Math.round(valor)}
          {sufijo}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={paso}
        value={valor}
        onChange={(e) => cambio(Number(e.target.value))}
        className="w-full accent-portal"
      />
    </label>
  );
}

// ---- Componente principal ------------------------------------------

export default function ControlesTaller({
  tarjeta,
  setTarjeta,
  idSeleccionado,
  setIdSeleccionado,
}: Props) {
  function actualizar<K extends keyof EstadoTarjeta>(
    clave: K,
    valor: EstadoTarjeta[K]
  ) {
    setTarjeta((t) => ({ ...t, [clave]: valor }));
  }

  // Sticker SVG: lo dejo en el centro y ya seleccionado así el usuario
  // puede moverlo o rotarlo sin tener que cazarlo primero.
  function agregarAdornoSvg(tipo: TipoAdorno) {
    const id = crypto.randomUUID();
    setTarjeta((t) => ({
      ...t,
      adornos: [
        ...t.adornos,
        { id, tipo, x: 50, y: 50, tamano: 60, rotacion: 0 },
      ],
    }));
    setIdSeleccionado(id);
  }

  // Sticker de imagen (mini-personaje de la API). Mismo flujo que SVG
  // pero arrancando en 80px porque los avatares son cuadrados.
  function agregarAdornoImagen(idPersonaje: number, nombre: string) {
    const id = crypto.randomUUID();
    setTarjeta((t) => ({
      ...t,
      adornos: [
        ...t.adornos,
        {
          id,
          tipo: "imagen",
          urlImagen: urlAvatar(idPersonaje),
          etiqueta: nombre,
          x: 50,
          y: 50,
          tamano: 80,
          rotacion: 0,
        },
      ],
    }));
    setIdSeleccionado(id);
  }

  function actualizarAdorno(id: string, cambios: Partial<Adorno>) {
    setTarjeta((t) => ({
      ...t,
      adornos: t.adornos.map((a) => (a.id === id ? { ...a, ...cambios } : a)),
    }));
  }

  function borrarAdorno(id: string) {
    setTarjeta((t) => ({
      ...t,
      adornos: t.adornos.filter((a) => a.id !== id),
    }));
    setIdSeleccionado(null);
  }

  // Reordeno por posición en el array: el último se renderea encima
  // por el orden del map del lienzo. "Frente" empuja al final, "atrás"
  // lo manda al principio.
  function reordenarAdorno(id: string, direccion: "frente" | "atras") {
    setTarjeta((t) => {
      const idx = t.adornos.findIndex((a) => a.id === id);
      if (idx < 0) return t;
      const adornos = [...t.adornos];
      const [item] = adornos.splice(idx, 1);
      if (direccion === "frente") adornos.push(item);
      else adornos.unshift(item);
      return { ...t, adornos };
    });
  }

  function quitarUltimoAdorno() {
    setTarjeta((t) => ({ ...t, adornos: t.adornos.slice(0, -1) }));
    setIdSeleccionado(null);
  }

  function vaciarAdornos() {
    setTarjeta((t) => ({ ...t, adornos: [] }));
    setIdSeleccionado(null);
  }

  const seleccionado =
    tarjeta.adornos.find((a) => a.id === idSeleccionado) ?? null;

  // Buscador para los mini-personajes. Son 16, no necesito red ni
  // debounce: filtro en memoria y listo.
  const [busquedaMini, setBusquedaMini] = useState("");
  const minisFiltrados = useMemo(() => {
    const q = busquedaMini.trim().toLowerCase();
    if (!q) return MINIS_PERSONAJE;
    return MINIS_PERSONAJE.filter((m) => m.nombre.toLowerCase().includes(q));
  }, [busquedaMini]);

  return (
    <div className="space-y-5 rounded-lg border border-portal/20 bg-espacio-2/60 p-4 backdrop-blur">
      {/* --- Filtro dimensional (mete el efecto sobre TODO el lienzo) --- */}
      <Seccion titulo="Filtro dimensional">
        <p className="tipo-mono text-[9px] text-papel/50">
          Aplica un look interdimensional a toda la tarjeta. Suma
          Schmeckles y queda guardado en el PNG.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {DIMENSIONES.map((d) => (
            <BotonPildora
              key={d.id}
              activo={tarjeta.dimension === d.id}
              onClick={() => actualizar("dimension", d.id as Dimension)}
              titulo={d.chiste}
            >
              {d.id !== "ninguna" && <Sparkles size={9} className="mr-1 inline" />}
              {d.nombre}
            </BotonPildora>
          ))}
        </div>
      </Seccion>

      {/* --- Marco --- */}
      <Seccion titulo="Marco">
        <div className="flex flex-wrap gap-1.5">
          {MARCOS.map((m) => (
            <BotonPildora
              key={m.id}
              activo={tarjeta.marco === m.id}
              onClick={() => actualizar("marco", m.id as Marco)}
              titulo={m.chiste}
            >
              {m.nombre}
            </BotonPildora>
          ))}
        </div>
      </Seccion>

      {/* --- Forma --- */}
      <Seccion titulo="Forma">
        <div className="flex flex-wrap gap-1.5">
          {FORMAS.map((f) => (
            <BotonPildora
              key={f.id}
              activo={tarjeta.forma === f.id}
              onClick={() => actualizar("forma", f.id as Forma)}
            >
              {f.nombre}
            </BotonPildora>
          ))}
        </div>
      </Seccion>

      {/* --- Orientación --- */}
      <Seccion titulo="Orientación">
        <div className="flex gap-1.5">
          {ORIENTACIONES.map((o) => (
            <BotonPildora
              key={o.id}
              activo={tarjeta.orientacion === o.id}
              onClick={() => actualizar("orientacion", o.id as Orientacion)}
            >
              {o.nombre}
            </BotonPildora>
          ))}
        </div>
      </Seccion>

      {/* --- Rotación de la tarjeta entera --- */}
      <Seccion titulo="Rotación de la tarjeta">
        <Slider
          etiqueta="Inclinación"
          min={-8}
          max={8}
          valor={tarjeta.rotacionTarjeta}
          cambio={(v) => actualizar("rotacionTarjeta", v)}
          sufijo="°"
        />
      </Seccion>

      {/* --- Motivo (atajos) --- */}
      <Seccion titulo="Motivo">
        <div className="flex flex-wrap gap-1.5">
          {MOTIVOS.map((m) => (
            <BotonPildora
              key={m.id}
              activo={tarjeta.motivo === m.texto}
              onClick={() => actualizar("motivo", m.texto)}
            >
              {m.texto}
            </BotonPildora>
          ))}
        </div>
      </Seccion>

      {/* --- Textos arriba / abajo --- */}
      <Seccion titulo="Textos">
        <input
          type="text"
          maxLength={50}
          placeholder="Texto superior"
          value={tarjeta.textoSuperior}
          onChange={(e) => actualizar("textoSuperior", e.target.value)}
          className="w-full rounded-md border border-papel/20 bg-espacio/60 px-3 py-2 text-sm text-papel placeholder:text-papel/40 focus:border-portal focus:outline-none"
        />
        <input
          type="text"
          maxLength={50}
          placeholder="Texto inferior"
          value={tarjeta.textoInferior}
          onChange={(e) => actualizar("textoInferior", e.target.value)}
          className="w-full rounded-md border border-papel/20 bg-espacio/60 px-3 py-2 text-sm text-papel placeholder:text-papel/40 focus:border-portal focus:outline-none"
        />
        {/* Generador de citas del show. Reemplaza el texto inferior
            con una frase aleatoria. El input sigue siendo editable. */}
        <button
          type="button"
          onClick={() => {
            const frase =
              FRASES_ICONICAS[Math.floor(Math.random() * FRASES_ICONICAS.length)];
            actualizar("textoInferior", frase);
          }}
          className="boton-tactil tipo-mono flex w-full items-center justify-center gap-1.5 rounded-md border border-cosmos-2/60 bg-cosmos/30 px-3 py-1.5 text-[10px] uppercase tracking-wider text-papel transition-colors hover:bg-cosmos/50"
          title="Pone una frase icónica del show en el texto inferior"
        >
          <Quote size={11} />
          Frase del show (random)
        </button>
      </Seccion>

      {/* --- Paleta + color pickers --- */}
      <Seccion titulo="Paleta">
        <div className="flex flex-wrap gap-1.5">
          {PALETAS.map((p) => (
            <button
              key={p.nombre}
              type="button"
              onClick={() => {
                actualizar("colorFondo", p.fondo);
                actualizar("colorTexto", p.texto);
              }}
              title={p.nombre}
              className="flex h-8 w-12 overflow-hidden rounded border border-papel/20 transition-transform hover:scale-105"
            >
              <span className="flex-1" style={{ background: p.fondo }} />
              <span className="flex-1" style={{ background: p.texto }} />
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2 text-[10px] text-papel/70">
          <label className="flex items-center gap-1">
            <span className="tipo-mono">Fondo</span>
            <input
              type="color"
              value={tarjeta.colorFondo}
              onChange={(e) => actualizar("colorFondo", e.target.value)}
              className="h-7 w-10 cursor-pointer rounded bg-transparent"
            />
          </label>
          <label className="flex items-center gap-1">
            <span className="tipo-mono">Texto</span>
            <input
              type="color"
              value={tarjeta.colorTexto}
              onChange={(e) => actualizar("colorTexto", e.target.value)}
              className="h-7 w-10 cursor-pointer rounded bg-transparent"
            />
          </label>
        </div>
      </Seccion>

      {/* --- Stickers de personajes (avatares de la API) ----------- */}
      <Seccion titulo="Pegar mini-personaje">
        <p className="tipo-mono text-[9px] text-papel/50">
          Click → cae al centro y lo arrastrás. Busá por nombre abajo.
        </p>

        {/* Buscador de mini-personajes */}
        <div className="flex items-center gap-2 rounded-md border border-papel/20 bg-espacio/60 px-2 py-1.5 focus-within:border-portal">
          <Search size={12} className="text-portal" />
          <input
            type="search"
            value={busquedaMini}
            onChange={(e) => setBusquedaMini(e.target.value)}
            placeholder="Rick, Morty, Pickle…"
            aria-label="Buscar mini-personaje"
            className="w-full bg-transparent text-[11px] text-papel placeholder:text-papel/40 focus:outline-none"
          />
          {busquedaMini && (
            <button
              type="button"
              onClick={() => setBusquedaMini("")}
              aria-label="Limpiar búsqueda"
              className="text-papel/50 hover:text-papel"
            >
              <X size={11} />
            </button>
          )}
        </div>

        {minisFiltrados.length === 0 ? (
          <p className="tipo-mono rounded-md border border-papel/10 bg-espacio/40 p-3 text-center text-[10px] text-papel/60">
            Este personaje fue borrado por el Consejo de Ricks. Probá otra búsqueda.
          </p>
        ) : (
          <div className="grid grid-cols-6 gap-1.5">
            {minisFiltrados.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => agregarAdornoImagen(p.id, p.nombre)}
                title={`Pegar ${p.nombre}`}
                className="overflow-hidden rounded-full border border-papel/20 bg-espacio/40 transition-all hover:scale-110 hover:border-portal hover:shadow-[0_0_12px_rgba(151,206,76,0.6)]"
              >
                <img
                  src={urlAvatar(p.id)}
                  alt={p.nombre}
                  className="block aspect-square w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget.parentElement as HTMLElement).style.display =
                      "none";
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </Seccion>

      {/* --- Sellos de pasaporte multiversal --------------------- */}
      <Seccion titulo="Sellos de pasaporte multiversal">
        <p className="tipo-mono text-[9px] text-papel/50">
          Estampas oficiales tipo aduana. Quedan mejor inclinadas en
          una esquina.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(["sello-federacion", "sello-ciudadela", "sello-aprobado"] as const).map((tipo) => {
            const Comp = ADORNOS[tipo];
            return (
              <button
                key={tipo}
                type="button"
                onClick={() => agregarAdornoSvg(tipo)}
                title={`Agregar ${NOMBRE_ADORNO[tipo]}`}
                className="group flex flex-col items-center justify-center gap-1 rounded-md border border-papel/20 bg-espacio/40 p-2 transition-all hover:scale-105 hover:border-acido hover:bg-acido/10"
              >
                <Comp tamano={56} rotacion={0} />
                <span className="tipo-mono text-center text-[8px] leading-tight text-papel/70">
                  {NOMBRE_ADORNO[tipo].replace("Sello ", "")}
                </span>
              </button>
            );
          })}
        </div>
      </Seccion>

      {/* --- Catálogo de adornos SVG temáticos --------------------- */}
      <Seccion
        titulo={`Adornos temáticos (${tarjeta.adornos.length} en la tarjeta)`}
      >
        <p className="tipo-mono text-[9px] text-papel/50">
          Nave de Rick, Portal Gun, Plumbus, Sr. Meeseeks, Cromulón…
        </p>
        <div className="grid grid-cols-4 gap-2">
          {TIPOS_ADORNO.filter((t) => !t.startsWith("sello-")).map((tipo) => {
            const Comp = ADORNOS[tipo];
            return (
              <button
                key={tipo}
                type="button"
                onClick={() => agregarAdornoSvg(tipo)}
                title={`Agregar ${NOMBRE_ADORNO[tipo]}`}
                className="group flex items-center justify-center rounded-md border border-papel/20 bg-espacio/40 p-2 transition-all hover:border-portal hover:bg-portal/10 hover:scale-105"
              >
                <Comp tamano={28} rotacion={0} />
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <BotonPildora activo={false} onClick={quitarUltimoAdorno}>
            <RotateCcw size={10} className="mr-1 inline" />
            Deshacer último
          </BotonPildora>
          <BotonPildora activo={false} onClick={vaciarAdornos}>
            <Trash2 size={10} className="mr-1 inline" />
            Limpiar todos
          </BotonPildora>
        </div>
      </Seccion>

      {/* --- Lista clickeable de adornos --- */}
      {tarjeta.adornos.length > 0 && (
        <Seccion titulo="Adornos en la tarjeta">
          <ul className="grid grid-cols-6 gap-1.5">
            {tarjeta.adornos.map((a, idx) => {
              const esImagen = a.tipo === "imagen";
              const Comp = !esImagen
                ? ADORNOS[a.tipo as TipoAdorno]
                : null;
              const activo = a.id === idSeleccionado;
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setIdSeleccionado(activo ? null : a.id)
                    }
                    title={a.etiqueta || `${a.tipo} #${idx + 1}`}
                    className={[
                      "flex w-full items-center justify-center overflow-hidden rounded-md border p-1 transition-all",
                      activo
                        ? "border-portal bg-portal/20"
                        : "border-papel/20 bg-espacio/40 hover:border-portal/50",
                    ].join(" ")}
                  >
                    {esImagen && a.urlImagen ? (
                      <img
                        src={a.urlImagen}
                        alt={a.etiqueta || "sticker"}
                        className="aspect-square w-full rounded-full object-cover"
                      />
                    ) : (
                      Comp && <Comp tamano={22} rotacion={0} />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </Seccion>
      )}

      {/* --- Panel del adorno seleccionado ------------------------- */}
      {seleccionado && (
        <section className="space-y-3 rounded-md border border-portal/40 bg-portal/5 p-3">
          <div className="flex items-center justify-between">
            <h3 className="tipo-mono text-[10px] text-portal">
              Editar:{" "}
              {seleccionado.tipo === "imagen"
                ? seleccionado.etiqueta || "sticker"
                : NOMBRE_ADORNO[seleccionado.tipo as TipoAdorno] ||
                  seleccionado.tipo}
            </h3>
            <button
              type="button"
              onClick={() => setIdSeleccionado(null)}
              title="Cerrar edición"
              className="rounded p-1 text-papel/60 hover:bg-papel/10 hover:text-papel"
            >
              <X size={12} />
            </button>
          </div>

          <Slider
            etiqueta="Tamaño"
            min={20}
            max={220}
            valor={seleccionado.tamano}
            cambio={(v) => actualizarAdorno(seleccionado.id, { tamano: v })}
            sufijo="px"
          />
          <Slider
            etiqueta="Rotación"
            min={-180}
            max={180}
            valor={seleccionado.rotacion}
            cambio={(v) => actualizarAdorno(seleccionado.id, { rotacion: v })}
            sufijo="°"
          />
          <Slider
            etiqueta="Posición X"
            min={0}
            max={100}
            valor={seleccionado.x}
            cambio={(v) => actualizarAdorno(seleccionado.id, { x: v })}
            sufijo="%"
          />
          <Slider
            etiqueta="Posición Y"
            min={0}
            max={100}
            valor={seleccionado.y}
            cambio={(v) => actualizarAdorno(seleccionado.id, { y: v })}
            sufijo="%"
          />

          <div className="flex flex-wrap gap-1.5">
            <BotonPildora
              activo={false}
              onClick={() => reordenarAdorno(seleccionado.id, "frente")}
              titulo="Traer al frente"
            >
              <ChevronUp size={10} className="mr-1 inline" />
              Al frente
            </BotonPildora>
            <BotonPildora
              activo={false}
              onClick={() => reordenarAdorno(seleccionado.id, "atras")}
              titulo="Mandar atrás"
            >
              <ChevronDown size={10} className="mr-1 inline" />
              Atrás
            </BotonPildora>
            <BotonPildora
              activo={false}
              onClick={() => borrarAdorno(seleccionado.id)}
              titulo="Eliminar este adorno"
            >
              <Trash2 size={10} className="mr-1 inline" />
              Borrar
            </BotonPildora>
          </div>
        </section>
      )}
    </div>
  );
}
