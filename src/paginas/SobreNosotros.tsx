// Página "quién está detrás". Sin team grid genérico ni avatares stock,
// la voz es la del proyecto y nada más.
import TransicionPagina from "../componentes/TransicionPagina";

export default function SobreNosotros() {
  return (
    <TransicionPagina>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <span className="tipo-mono text-xs text-portal">
          Expediente del taller
        </span>
        <h1 className="tipo-display mt-2 text-4xl md:text-5xl">
          Una imprenta interdimensional muy chica.
        </h1>

        <div className="mt-6 space-y-4 text-papel/80">
          <p>
            Esto empezó en 2023 como un proyecto de fin de bootcamp. La idea
            original era una tienda de tarjetas impresas (con botón "Comprar"
            que abría un modal de "gracias por tu compra" y no compraba nada,
            jeje). Funcionaba, pero se sentía a entrega de curso.
          </p>

          <p>
            En 2025 lo retomé. Bajé el catálogo de pagos, subí el catálogo de
            cariño. Ahora cualquier persona puede armar su tarjeta y bajársela
            como imagen, sin login, sin watermark, sin "suscribite a nuestro
            boletín". Lo que sale, sale. Si te gusta, mándale a alguien y
            decile que pensaste en él.
          </p>

          <p>
            <strong className="text-portal">¿Por qué Rick &amp; Morty?</strong>{" "}
            Porque la serie tiene un universo infinito y porque me gusta dibujar
            portales. Si fuera Steven Universe sería distinto, pero también.
          </p>

          <p>
            <strong className="text-portal">¿Por qué gratis?</strong> Porque
            internet está lleno de cosas que ya te cobran. Esta no. Si querés
            agradecer, contale a alguien que un humano hizo este lugar a mano,
            con comentarios en español, y que el código está
            <a
              className="ml-1 text-acido underline-offset-4 hover:underline"
              href="https://github.com/ReichertK/ryck-y-morty-3"
              target="_blank"
              rel="noreferrer"
            >
              acá
            </a>
            .
          </p>
        </div>

        {/* Ficha estilo "expediente" como guiño al proyecto original */}
        <div className="mt-10 rounded-md border border-dashed border-portal/40 bg-espacio-2/40 p-5 backdrop-blur">
          <p className="tipo-mono mb-2 text-[10px] text-portal">
            EXPEDIENTE C-137
          </p>
          <dl className="grid gap-2 text-sm md:grid-cols-2">
            <div>
              <dt className="tipo-mono text-[10px] text-papel/50">Origen</dt>
              <dd>La Plata, dimensión C-137</dd>
            </div>
            <div>
              <dt className="tipo-mono text-[10px] text-papel/50">Stack</dt>
              <dd>React · TypeScript · Vite · Tailwind · Framer Motion</dd>
            </div>
            <div>
              <dt className="tipo-mono text-[10px] text-papel/50">API</dt>
              <dd>rickandmortyapi.com (gracias, Axel!)</dd>
            </div>
            <div>
              <dt className="tipo-mono text-[10px] text-papel/50">Lema</dt>
              <dd className="italic">"Wubba lubba dub dub."</dd>
            </div>
          </dl>
        </div>
      </section>
    </TransicionPagina>
  );
}
