// Form de contacto. Validación en cliente nada más: el día que sume un
// backend lo enchufo acá. Por ahora muestra un cartelito honesto al
// usuario explicando que no se manda a ningún lado.
import { useState } from "react";
import TransicionPagina from "../componentes/TransicionPagina";
import Boton from "../componentes/Boton";
import { Send, Eraser } from "lucide-react";

type Errores = Partial<Record<"nombre" | "email" | "mensaje", string>>;

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const [enviado, setEnviado] = useState(false);

  // Reglas en un objeto: cada una se lee como una frase. Más cómodo
  // que una cadena de if-else cuando se vienen 2-3 más.
  function validar(): Errores {
    const e: Errores = {};
    if (nombre.trim().length < 2) e.nombre = "Poné al menos un nombre cortito.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
      e.email = "Ese email no me cierra. Revisalo, capo.";
    if (mensaje.trim().length < 10)
      e.mensaje = "Contame un poquito más (10 caracteres como mínimo).";
    return e;
  }

  function manejarEnvio(ev: React.FormEvent) {
    ev.preventDefault();
    const erroresActuales = validar();
    setErrores(erroresActuales);

    if (Object.keys(erroresActuales).length === 0) {
      // Cuando haya backend, acá va el fetch. Por ahora mostramos el
      // cartel de "recibido" y vaciamos el form así se ve algo.
      setEnviado(true);
      setNombre("");
      setEmail("");
      setMensaje("");
    }
  }

  function vaciar() {
    setNombre("");
    setEmail("");
    setMensaje("");
    setErrores({});
    setEnviado(false);
  }

  return (
    <TransicionPagina>
      <section className="mx-auto max-w-2xl px-4 py-12">
        <span className="tipo-mono text-xs text-portal">
          Asunto · escribinos
        </span>
        <h1 className="tipo-display mt-2 text-4xl md:text-5xl">
          Mandanos tu mensaje
        </h1>
        <p className="mt-2 text-papel/70">
          Bug encontrado, idea, propuesta de marco nuevo o simplemente
          saludo. Todo entra.
        </p>

        <form
          onSubmit={manejarEnvio}
          noValidate
          className="mt-8 space-y-4 rounded-lg border border-portal/20 bg-espacio-2/60 p-5 backdrop-blur"
        >
          <Campo
            id="nombre"
            etiqueta="Nombre"
            valor={nombre}
            cambio={setNombre}
            error={errores.nombre}
          />
          <Campo
            id="email"
            etiqueta="Email"
            tipo="email"
            valor={email}
            cambio={setEmail}
            error={errores.email}
            autoComplete="email"
          />
          <Campo
            id="mensaje"
            etiqueta="Mensaje"
            multilinea
            valor={mensaje}
            cambio={setMensaje}
            error={errores.mensaje}
          />

          <div className="flex flex-wrap items-center gap-2">
            <Boton variante="portal" type="submit">
              <Send size={14} />
              Enviar
            </Boton>
            <Boton variante="fantasma" type="button" onClick={vaciar}>
              <Eraser size={14} />
              Borrar todo
            </Boton>
          </div>

          {enviado && (
            <p
              role="status"
              className="rounded border border-portal/40 bg-portal/10 p-3 text-sm"
            >
              ¡Listo! Lo leemos cuando el portal nos lo entregue.
              <br />
              <span className="tipo-mono text-[10px] text-papel/60">
                (Spoiler: acá no hay backend todavía. Es práctica honesta.)
              </span>
            </p>
          )}
        </form>
      </section>
    </TransicionPagina>
  );
}

// Campo reutilizable. Lo dejo en el mismo archivo para no inflar el árbol.

function Campo({
  id,
  etiqueta,
  valor,
  cambio,
  error,
  tipo = "text",
  multilinea = false,
  autoComplete,
}: {
  id: string;
  etiqueta: string;
  valor: string;
  cambio: (v: string) => void;
  error?: string;
  tipo?: string;
  multilinea?: boolean;
  autoComplete?: string;
}) {
  const claseBase =
    "w-full rounded-md border bg-espacio/60 px-3 py-2 text-sm text-papel placeholder:text-papel/40 focus:outline-none";
  const claseEstado = error
    ? "border-sello focus:border-sello"
    : "border-papel/20 focus:border-portal";

  return (
    <div>
      <label htmlFor={id} className="tipo-mono mb-1 block text-[10px] text-papel/70">
        {etiqueta}
      </label>
      {multilinea ? (
        <textarea
          id={id}
          rows={5}
          value={valor}
          onChange={(e) => cambio(e.target.value)}
          className={`${claseBase} ${claseEstado}`}
        />
      ) : (
        <input
          id={id}
          type={tipo}
          autoComplete={autoComplete}
          value={valor}
          onChange={(e) => cambio(e.target.value)}
          className={`${claseBase} ${claseEstado}`}
        />
      )}
      {error && (
        <p className="tipo-mono mt-1 text-[10px] text-sello" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
