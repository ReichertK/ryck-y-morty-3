// 404 con humor. Si el usuario llegó acá algo se rompió en otro lado
// (link mal copiado, ruta vieja, etc); le doy un mensaje con onda
// y un botón para volver a casa.
import { Link } from "react-router-dom";
import TransicionPagina from "../componentes/TransicionPagina";
import Boton from "../componentes/Boton";

export default function NoEncontrado() {
  return (
    <TransicionPagina>
      <section className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="tipo-mono text-xs text-portal">Error 404</p>
        <h1 className="tipo-display mt-3 text-6xl">
          Esta dimensión no existe.
        </h1>
        <p className="mt-4 text-papel/70">
          O existe pero no la encontramos. Igual te recomiendo volver al
          inicio antes de que un Cromulón te haga cantar.
        </p>
        <div className="mt-6">
          <Link to="/">
            <Boton variante="portal">Volver al inicio</Boton>
          </Link>
        </div>
      </section>
    </TransicionPagina>
  );
}
