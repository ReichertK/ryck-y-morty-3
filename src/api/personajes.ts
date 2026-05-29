// Único punto de contacto con la API de Rick & Morty. Si mañana cambia
// la URL o suman parámetros, se toca sólo acá.

const API_URL = "https://rickandmortyapi.com/api";

// Tipo el personaje con los campos que uso, nada más. Si la API agrega
// algo nuevo no me obliga a actualizar el tipo.
export type Personaje = {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;             // subtipo dentro de la especie (puede venir "")
  gender: string;
  image: string;
  origin: { name: string };
  location: { name: string };
  episode: string[];        // urls de los episodios donde aparece
};

export type RespuestaPersonajes = {
  resultados: Personaje[];
  paginas: number;
  total: number;
};

// Los valores que acepta el endpoint /character. Los exporto para no
// dejar magic strings sueltos por toda la UI.
export const ESTADOS_VALIDOS = ["alive", "dead", "unknown"] as const;
export const GENEROS_VALIDOS = [
  "female",
  "male",
  "genderless",
  "unknown",
] as const;

export type EstadoApi = (typeof ESTADOS_VALIDOS)[number];
export type GeneroApi = (typeof GENEROS_VALIDOS)[number];

export type FiltrosPersonajes = {
  pagina?: number;
  nombre?: string;
  genero?: GeneroApi | "";
  estado?: EstadoApi | "";
  especie?: string;
  tipo?: string;            // ej: "Genetic experiment", "Parasite", etc.
};

// Trae una página de personajes con filtros opcionales. Si la API
// devuelve 404 (que es como dice "no encontré nada con esos filtros"),
// lo traduzco a lista vacía — el llamador no tiene que pensar en
// status codes.
export async function traerPersonajes(
  filtros: FiltrosPersonajes = {}
): Promise<RespuestaPersonajes> {
  const parametros = new URLSearchParams();
  if (filtros.pagina) parametros.set("page", String(filtros.pagina));
  if (filtros.nombre) parametros.set("name", filtros.nombre);
  if (filtros.genero) parametros.set("gender", filtros.genero);
  if (filtros.estado) parametros.set("status", filtros.estado);
  if (filtros.especie) parametros.set("species", filtros.especie);
  if (filtros.tipo) parametros.set("type", filtros.tipo);

  const url = `${API_URL}/character?${parametros.toString()}`;
  const respuesta = await fetch(url);

  if (respuesta.status === 404) {
    return { resultados: [], paginas: 0, total: 0 };
  }
  if (!respuesta.ok) {
    throw new Error(`La API respondió con estado ${respuesta.status}`);
  }

  const datos = await respuesta.json();
  return {
    resultados: datos.results,
    paginas: datos.info?.pages ?? 1,
    total: datos.info?.count ?? 0,
  };
}

// Bulk fetch por ids: /character/[1,2,3] devuelve un array. Para un id
// solo devuelve un objeto suelto — lo envuelvo en array para tener una
// firma consistente. Lo uso para los mini-personajes del taller.
export async function traerPorIds(ids: number[]): Promise<Personaje[]> {
  if (ids.length === 0) return [];
  const url = `${API_URL}/character/${ids.join(",")}`;
  const respuesta = await fetch(url);
  if (!respuesta.ok) return [];
  const datos = await respuesta.json();
  return Array.isArray(datos) ? datos : [datos];
}

// Avatar 300×300 ya recortado por la API. Perfecto como sticker:
// viene cuadrado, sin metadatos raros y con CORS abierto.
export function urlAvatar(id: number): string {
  return `${API_URL}/character/avatar/${id}.jpeg`;
}
