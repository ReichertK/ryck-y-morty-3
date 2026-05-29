// Listado de personajes con filtros completos: nombre (debounced),
// estado, género, especie, subtipo y un toggle de favoritos persistido
// en localStorage. Atajo "/" para enfocar el buscador estilo Linear.
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TransicionPagina from "../componentes/TransicionPagina";
import Boton from "../componentes/Boton";
import { EsqueletosGrilla } from "../componentes/EsqueletoTarjeta";
import { usePersonajes } from "../hooks/usePersonajes";
import { useFavoritos } from "../hooks/useLocalStorage";
import {
  ESPECIES_COMUNES,
  TIPOS_COMUNES,
  FRASES_VACIAS,
  FRASES_ERROR,
} from "../taller/catalogos";
import {
  ESTADOS_VALIDOS,
  GENEROS_VALIDOS,
  type EstadoApi,
  type GeneroApi,
} from "../api/personajes";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Wand2,
  Filter,
  X,
  MapPin,
  Tv,
  Star,
  Loader2,
} from "lucide-react";

const azar = (lista: readonly string[]) =>
  lista[Math.floor(Math.random() * lista.length)];

const TRAD_ESTADO: Record<EstadoApi, string> = {
  alive: "Vivo",
  dead: "Muerto",
  unknown: "Desconocido",
};
const TRAD_GENERO: Record<GeneroApi, string> = {
  female: "Femenino",
  male: "Masculino",
  genderless: "Sin género",
  unknown: "Desconocido",
};

export default function Galeria() {
  const [pagina, setPagina] = useState(1);
  const [nombre, setNombre] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState<EstadoApi | "">("");
  const [genero, setGenero] = useState<GeneroApi | "">("");
  const [especie, setEspecie] = useState("");
  const [tipo, setTipo] = useState("");
  const [soloFavoritos, setSoloFavoritos] = useState(false);

  const navegar = useNavigate();
  const { esFavorito, alternarFavorito, ids: idsFavoritos } = useFavoritos();
  const refBuscador = useRef<HTMLInputElement>(null);

  // "/" enfoca el buscador (a lo GitHub). Si ya estás tipeando en un
  // input, no le robo la tecla.
  useEffect(() => {
    function manejar(ev: KeyboardEvent) {
      if (ev.key !== "/" || ev.ctrlKey || ev.metaKey) return;
      const t = ev.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      ev.preventDefault();
      refBuscador.current?.focus();
    }
    window.addEventListener("keydown", manejar);
    return () => window.removeEventListener("keydown", manejar);
  }, []);

  // Debounce 350ms: no quiero pegarle a la API por cada tecla.
  useEffect(() => {
    const t = setTimeout(() => {
      setBusqueda(nombre.trim());
      setPagina(1);
    }, 350);
    return () => clearTimeout(t);
  }, [nombre]);

  useEffect(() => {
    setPagina(1);
  }, [estado, genero, especie, tipo, soloFavoritos]);

  const { personajes, paginas, cargando, error } = usePersonajes({
    pagina,
    nombre: busqueda || undefined,
    estado: estado || undefined,
    genero: genero || undefined,
    especie: especie || undefined,
    tipo: tipo || undefined,
  });

  // Si está activo "solo favoritos", filtro la página actual. No es
  // ideal porque la API no banca filtrar por id en bulk junto con el
  // resto de params, pero es honesto: muestra los favoritos que cayeron
  // en esta página y listo.
  const personajesVisibles = useMemo(
    () => (soloFavoritos ? personajes.filter((p) => esFavorito(p.id)) : personajes),
    [personajes, soloFavoritos, esFavorito]
  );

  const filtrosActivos = useMemo(
    () =>
      [busqueda, estado, genero, especie, tipo, soloFavoritos ? "fav" : ""]
        .filter((x) => x !== "").length,
    [busqueda, estado, genero, especie, tipo, soloFavoritos]
  );

  function limpiarFiltros() {
    setNombre("");
    setBusqueda("");
    setEstado("");
    setGenero("");
    setEspecie("");
    setTipo("");
    setSoloFavoritos(false);
    setPagina(1);
  }

  // Cuando el input difiere del valor que ya pegó contra la API,
  // mostramos un spinner. Feedback visual mientras corre el debounce.
  const buscandoEnVivo = nombre.trim() !== busqueda;

  return (
    <TransicionPagina>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="tipo-mono text-xs text-portal">
              Archivo del multiverso
            </span>
            <h1 className="tipo-display mt-1 text-4xl md:text-5xl">
              Buscá tu personaje
            </h1>
            <p className="mt-2 text-papel/70">
              Filtrá por nombre, estado, especie, tipo o género. Apretá
              <kbd className="tecla-tip mx-1.5">/</kbd>
              para enfocar la búsqueda.
            </p>
          </div>

          {/* Buscador */}
          <div className="flex w-full max-w-sm items-center gap-2 rounded-md border border-portal/30 bg-espacio-2/60 px-3 py-2 backdrop-blur focus-within:border-portal">
            {buscandoEnVivo ? (
              <Loader2 size={16} className="animate-spin text-portal" />
            ) : (
              <Search size={16} className="text-portal" />
            )}
            <input
              ref={refBuscador}
              type="search"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Morty, Birdperson, Squanchy…"
              aria-label="Buscar personaje por nombre"
              className="w-full bg-transparent text-sm text-papel placeholder:text-papel/40 focus:outline-none"
            />
            {nombre && (
              <button
                type="button"
                onClick={() => setNombre("")}
                aria-label="Limpiar nombre"
                className="text-papel/50 transition-colors hover:text-papel"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </header>

        {/* Panel de filtros */}
        <div className="mt-6 rounded-lg border border-portal/20 bg-espacio-2/60 p-4 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-portal" />
              <h2 className="tipo-mono text-[11px] text-portal">
                Filtros avanzados
                {filtrosActivos > 0 && (
                  <span className="ml-2 rounded-full bg-portal/20 px-2 py-0.5 text-[9px] text-portal">
                    {filtrosActivos} activo
                    {filtrosActivos === 1 ? "" : "s"}
                  </span>
                )}
              </h2>
            </div>
            {filtrosActivos > 0 && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="tipo-mono flex items-center gap-1 text-[10px] text-papel/70 transition-colors hover:text-portal"
              >
                <X size={10} />
                Limpiar todo
              </button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <CampoSelect
              etiqueta="Estado"
              valor={estado}
              cambio={(v) => setEstado(v as EstadoApi | "")}
              opciones={ESTADOS_VALIDOS.map((e) => ({ valor: e, texto: TRAD_ESTADO[e] }))}
            />
            <CampoSelect
              etiqueta="Género"
              valor={genero}
              cambio={(v) => setGenero(v as GeneroApi | "")}
              opciones={GENEROS_VALIDOS.map((g) => ({ valor: g, texto: TRAD_GENERO[g] }))}
            />
            <CampoConDatalist
              etiqueta="Especie"
              listaId="especies-comunes"
              opciones={ESPECIES_COMUNES}
              valor={especie}
              cambio={setEspecie}
              placeholder="Human, Alien, Robot…"
            />
            <CampoConDatalist
              etiqueta="Subtipo"
              listaId="tipos-comunes"
              opciones={TIPOS_COMUNES}
              valor={tipo}
              cambio={setTipo}
              placeholder="Parasite, Clone…"
            />
          </div>

          {/* Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="tipo-mono mr-1 text-[9px] text-papel/40">Atajos:</span>
            {(["alive", "dead", "unknown"] as const).map((e) => (
              <Chip key={e} activo={estado === e} onClick={() => setEstado(estado === e ? "" : e)}>
                {TRAD_ESTADO[e]}
              </Chip>
            ))}
            {ESPECIES_COMUNES.slice(0, 5).map((e) => (
              <Chip key={e} activo={especie === e} onClick={() => setEspecie(especie === e ? "" : e)}>
                {e}
              </Chip>
            ))}
            {/* Chip especial de favoritos */}
            <Chip
              activo={soloFavoritos}
              onClick={() => setSoloFavoritos((v) => !v)}
              acento="acido"
              titulo={`${idsFavoritos.length} favoritos guardados`}
            >
              <Star size={9} className={soloFavoritos ? "fill-acido" : ""} />
              Solo favoritos ({idsFavoritos.length})
            </Chip>
          </div>
        </div>

        {/* Estados */}
        {cargando && (
          <ul
            className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            aria-busy="true"
            aria-label="Cargando personajes"
          >
            <EsqueletosGrilla cantidad={8} />
          </ul>
        )}
        {error && !cargando && (
          <p className="mt-10 rounded-md border border-sello/50 bg-sello/10 p-4 text-sm" role="alert">
            {azar(FRASES_ERROR)} <br />
            <span className="text-papel/50">(detalle: {error})</span>
          </p>
        )}
        {!cargando && !error && personajesVisibles.length === 0 && (
          <p className="mt-10 rounded-md border border-papel/20 bg-espacio-2/60 p-4 text-sm text-papel/70">
            {soloFavoritos
              ? "Todavía no marcaste ningún favorito en esta página. Tocá la estrella en alguna card y volvemos."
              : azar(FRASES_VACIAS)}
          </p>
        )}

        {/* Grilla */}
        <AnimatePresence mode="popLayout">
          {!cargando && personajesVisibles.length > 0 && (
            <motion.ul
              key={`pag-${pagina}-${soloFavoritos ? "fav" : "all"}`}
              className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              initial="oculta"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.04 } },
              }}
            >
              {personajesVisibles.map((p) => {
                const esFav = esFavorito(p.id);
                return (
                  <motion.li
                    key={p.id}
                    layout
                    variants={{
                      oculta: { opacity: 0, y: 14 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    whileHover={{ y: -4 }}
                    className="group relative overflow-hidden rounded-lg border border-portal/20 bg-espacio-2/60 backdrop-blur transition-shadow hover:border-portal/60 hover:shadow-[0_0_24px_-6px_rgba(151,206,76,0.5)]"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-espacio/80" />

                      {/* Botón favorito flotante (esquina superior izq) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          alternarFavorito(p.id);
                        }}
                        aria-label={esFav ? "Quitar de favoritos" : "Agregar a favoritos"}
                        aria-pressed={esFav}
                        className={[
                          "absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full border backdrop-blur-sm transition-all hover:scale-110",
                          esFav
                            ? "border-acido bg-acido/20 text-acido"
                            : "border-papel/30 bg-espacio/40 text-papel/60 hover:border-acido/60 hover:text-acido",
                        ].join(" ")}
                      >
                        <Star size={14} className={esFav ? "fill-acido" : ""} />
                      </button>
                    </div>

                    <div className="p-3">
                      <h3 className="tipo-display text-lg leading-tight">{p.name}</h3>
                      <p className="tipo-mono mt-1 text-[10px] text-papel/60">
                        {p.species}
                        {p.type && ` · ${p.type}`}
                        {p.gender && ` · ${p.gender}`}
                      </p>
                      <p className="tipo-mono mt-1 flex items-center gap-1 text-[10px] text-papel/50">
                        <MapPin size={9} className="text-portal" />
                        {p.origin?.name || "Origen desconocido"}
                      </p>
                      <p className="tipo-mono mt-0.5 flex items-center gap-1 text-[10px] text-papel/50">
                        <Tv size={9} className="text-portal" />
                        {p.episode.length} episodio
                        {p.episode.length === 1 ? "" : "s"}
                      </p>
                      <div className="mt-3">
                        <Boton
                          variante="portal"
                          className="w-full"
                          onClick={() => navegar("/taller", { state: { personaje: p } })}
                        >
                          <Wand2 size={12} />
                          Llevar al taller
                        </Boton>
                      </div>
                    </div>

                    <span
                      className={[
                        "tipo-mono absolute right-2 top-2 rotate-6 rounded border px-1.5 py-0.5 text-[8px] backdrop-blur-sm",
                        p.status === "Alive"
                          ? "border-portal bg-portal/10 text-portal"
                          : p.status === "Dead"
                          ? "border-sello bg-sello/10 text-sello"
                          : "border-papel/40 bg-espacio/40 text-papel/60",
                      ].join(" ")}
                    >
                      {p.status === "Alive" ? "VIVO" : p.status === "Dead" ? "MUERTO" : "???"}
                    </span>
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>

        {/* Paginación */}
        {!cargando && paginas > 1 && !soloFavoritos && (
          <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Paginación">
            <Boton
              variante="fantasma"
              disabled={pagina <= 1}
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={14} />
              Anterior
            </Boton>
            <span className="tipo-mono text-xs text-papel/70">
              Página {pagina} / {paginas}
            </span>
            <Boton
              variante="fantasma"
              disabled={pagina >= paginas}
              onClick={() => setPagina((p) => Math.min(paginas, p + 1))}
            >
              Siguiente
              <ChevronRight size={14} />
            </Boton>
          </nav>
        )}
      </section>
    </TransicionPagina>
  );
}

// ---- Subcomponentes locales ----------------------------------------

function CampoSelect({
  etiqueta,
  valor,
  cambio,
  opciones,
}: {
  etiqueta: string;
  valor: string;
  cambio: (v: string) => void;
  opciones: { valor: string; texto: string }[];
}) {
  const id = `f-${etiqueta.toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="tipo-mono mb-1 block text-[9px] text-papel/60">
        {etiqueta.toUpperCase()}
      </label>
      <select
        id={id}
        value={valor}
        onChange={(e) => cambio(e.target.value)}
        className="w-full rounded-md border border-papel/20 bg-espacio/60 px-2 py-1.5 text-xs text-papel transition-colors focus:border-portal focus:outline-none"
      >
        <option value="">Todos</option>
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.texto}
          </option>
        ))}
      </select>
    </div>
  );
}

function CampoConDatalist({
  etiqueta,
  listaId,
  opciones,
  valor,
  cambio,
  placeholder,
}: {
  etiqueta: string;
  listaId: string;
  opciones: readonly string[];
  valor: string;
  cambio: (v: string) => void;
  placeholder: string;
}) {
  const id = `f-${etiqueta.toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="tipo-mono mb-1 block text-[9px] text-papel/60">
        {etiqueta.toUpperCase()}
      </label>
      <input
        id={id}
        list={listaId}
        value={valor}
        onChange={(e) => cambio(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-papel/20 bg-espacio/60 px-2 py-1.5 text-xs text-papel placeholder:text-papel/40 transition-colors focus:border-portal focus:outline-none"
      />
      <datalist id={listaId}>
        {opciones.map((o) => (
          <option key={o} value={o} />
        ))}
      </datalist>
    </div>
  );
}

function Chip({
  activo,
  onClick,
  children,
  acento = "portal",
  titulo,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
  acento?: "portal" | "acido";
  titulo?: string;
}) {
  const colorActivo =
    acento === "acido"
      ? "border-acido bg-acido/20 text-acido"
      : "border-portal bg-portal/20 text-portal";
  return (
    <button
      type="button"
      onClick={onClick}
      title={titulo}
      className={[
        "tipo-mono inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] transition-all hover:scale-105",
        activo ? colorActivo : "border-papel/20 text-papel/60 hover:border-papel/50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
