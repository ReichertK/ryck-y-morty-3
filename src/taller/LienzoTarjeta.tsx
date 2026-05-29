// El preview que el usuario ve y que después se baja como PNG. Recibe
// el estado completo y dibuja marco, foto, textos y adornos.
//
// Bancamos DRAG de adornos (mouse o dedo) y selección por click para
// después editarles tamaño/rotación desde el panel de la derecha.
// Durante la descarga, el padre nos pasa `modoCaptura` y escondemos
// outlines así el PNG sale limpio.
import { forwardRef, useRef } from "react";
import type { EstadoTarjeta, Adorno } from "./tipos";
import { ADORNOS } from "./adornosSvg";
import { DIMENSIONES, type TipoAdorno } from "./catalogos";

type Props = {
  tarjeta: EstadoTarjeta;
  idSeleccionado?: string | null;
  onSeleccionar?: (id: string | null) => void;
  onActualizarAdorno?: (id: string, cambios: Partial<Adorno>) => void;
  /** Durante la descarga PNG escondemos handles y outlines. */
  modoCaptura?: boolean;
};

// Tamaño lógico del lienzo. Todo lo demás escala desde estos números.
const ANCHO_VERTICAL = 480;
const ALTO_VERTICAL = 640;

function dimensiones(tarjeta: EstadoTarjeta) {
  const esCuadrada = tarjeta.forma === "cuadrada";
  const esCircular = tarjeta.forma === "circular";

  if (esCuadrada || esCircular) {
    const lado = Math.min(ANCHO_VERTICAL, ALTO_VERTICAL);
    return { ancho: lado, alto: lado };
  }
  if (tarjeta.orientacion === "horizontal") {
    return { ancho: ALTO_VERTICAL, alto: ANCHO_VERTICAL };
  }
  return { ancho: ANCHO_VERTICAL, alto: ALTO_VERTICAL };
}

function estiloMarco(tarjeta: EstadoTarjeta): React.CSSProperties {
  const base: React.CSSProperties = {
    background: tarjeta.colorFondo,
    color: tarjeta.colorTexto,
    transition: "background 0.3s ease, color 0.3s ease",
  };

  switch (tarjeta.marco) {
    case "polaroid":
      return {
        ...base,
        padding: "20px 20px 70px",
        boxShadow: "0 18px 40px -22px rgba(0,0,0,0.6)",
      };
    case "ficha":
      return {
        ...base,
        padding: 24,
        border: "1px dashed currentColor",
        boxShadow: "inset 0 0 0 6px rgba(255,255,255,0.04)",
      };
    case "portal":
      return {
        ...base,
        padding: 18,
        border: "6px solid #97ce4c",
        boxShadow:
          "0 0 0 4px #4f8a2c, 0 0 30px rgba(151,206,76,0.55)",
        borderRadius: 18,
      };
    case "rasgado":
      return {
        ...base,
        padding: 22,
        clipPath:
          "polygon(0% 4%, 5% 0%, 14% 3%, 24% 0%, 38% 5%, 50% 0%, 65% 3%, 78% 0%, 90% 4%, 100% 2%, 98% 14%, 100% 28%, 96% 42%, 100% 58%, 97% 72%, 100% 88%, 96% 100%, 82% 97%, 70% 100%, 55% 96%, 42% 100%, 28% 97%, 14% 100%, 4% 96%, 0% 86%, 3% 72%, 0% 58%, 4% 42%, 0% 28%, 3% 14%)",
      };
    case "neon":
      return {
        ...base,
        padding: 22,
        border: "2px solid #ffd23f",
        boxShadow:
          "0 0 0 4px #ec1c24, 0 0 20px #ffd23f, inset 0 0 30px rgba(255,210,63,0.15)",
        borderRadius: 12,
      };
    case "sello":
      return {
        ...base,
        padding: 24,
        backgroundImage: `radial-gradient(circle, transparent 6px, ${tarjeta.colorFondo} 7px)`,
        backgroundSize: "16px 16px",
        backgroundPosition: "-8px -8px",
      };
  }
}

function bordeForma(tarjeta: EstadoTarjeta): React.CSSProperties {
  if (tarjeta.forma === "circular") return { borderRadius: "50%" };
  if (tarjeta.forma === "arco") {
    return { borderRadius: "50% 50% 12px 12px / 30% 30% 12px 12px" };
  }
  return {};
}

// Sub: un adorno arrastrable y seleccionable.
type PropsAdorno = {
  adorno: Adorno;
  seleccionado: boolean;
  modoCaptura: boolean;
  onSeleccionar: (id: string | null) => void;
  onActualizar: (id: string, cambios: Partial<Adorno>) => void;
};

function AdornoArrastrable({
  adorno,
  seleccionado,
  modoCaptura,
  onSeleccionar,
  onActualizar,
}: PropsAdorno) {
  // Cacheo el rect del lienzo en una ref: lo necesito para mapear el
  // pointer a porcentajes, pero recalcularlo en cada move sería regalado.
  // Lo refresco sólo al arrancar el drag.
  const refLienzo = useRef<DOMRect | null>(null);

  // Dos sabores de adorno: SVG (catálogo cerrado) o IMAGEN (sticker
  // de la API). El switch es a propósito feo, pero los unifica con un
  // mismo wrapper de drag.
  const esImagen = adorno.tipo === "imagen" && !!adorno.urlImagen;
  const Componente = esImagen ? null : ADORNOS[adorno.tipo as TipoAdorno];
  if (!esImagen && !Componente) return null;

  function manejarPointerDown(ev: React.PointerEvent<HTMLDivElement>) {
    if (modoCaptura) return;
    ev.preventDefault();
    ev.stopPropagation();
    onSeleccionar(adorno.id);

    const lienzo = (ev.currentTarget as HTMLElement).closest<HTMLElement>(
      "[data-lienzo]"
    );
    if (!lienzo) return;
    refLienzo.current = lienzo.getBoundingClientRect();
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
  }

  function manejarPointerMove(ev: React.PointerEvent<HTMLDivElement>) {
    const rect = refLienzo.current;
    if (!rect) return;
    const x = ((ev.clientX - rect.left) / rect.width) * 100;
    const y = ((ev.clientY - rect.top) / rect.height) * 100;
    onActualizar(adorno.id, {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  }

  function manejarPointerUp(ev: React.PointerEvent<HTMLDivElement>) {
    refLienzo.current = null;
    try {
      (ev.currentTarget as HTMLElement).releasePointerCapture(ev.pointerId);
    } catch {
      // Ya estaba liberado, nada que hacer.
    }
  }

  const mostrarMarcas = seleccionado && !modoCaptura;

  return (
    <div
      onPointerDown={manejarPointerDown}
      onPointerMove={manejarPointerMove}
      onPointerUp={manejarPointerUp}
      onPointerCancel={manejarPointerUp}
      style={{
        position: "absolute",
        left: `${adorno.x}%`,
        top: `${adorno.y}%`,
        transform: "translate(-50%, -50%)",
        cursor: modoCaptura ? "default" : "grab",
        touchAction: "none",
        userSelect: "none",
        outline: mostrarMarcas ? "2px dashed #97ce4c" : "none",
        outlineOffset: 4,
        borderRadius: esImagen ? "50%" : 4,
        // Sombrita en los stickers para que no se mimeticen con el fondo.
        filter: esImagen ? "drop-shadow(0 4px 6px rgba(0,0,0,0.35))" : undefined,
      }}
      title={modoCaptura ? "" : adorno.etiqueta || "Arrastrame para moverme"}
    >
      {esImagen ? (
        <img
          src={adorno.urlImagen}
          alt={adorno.etiqueta || "adorno"}
          crossOrigin="anonymous"
          draggable={false}
          style={{
            width: adorno.tamano,
            height: adorno.tamano,
            objectFit: "cover",
            borderRadius: "50%",
            transform: `rotate(${adorno.rotacion}deg)`,
            border: "3px solid #97ce4c",
            pointerEvents: "none",
            display: "block",
          }}
          onError={(e) => {
            // Si el sticker tira 404, lo escondo en vez de dejar el
            // icón roto a la vista.
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        Componente && (
          <Componente tamano={adorno.tamano} rotacion={adorno.rotacion} />
        )
      )}
    </div>
  );
}

// Componente principal del lienzo.
const LienzoTarjeta = forwardRef<HTMLDivElement, Props>(function LienzoTarjeta(
  {
    tarjeta,
    idSeleccionado = null,
    onSeleccionar,
    onActualizarAdorno,
    modoCaptura = false,
  },
  ref
) {
  const { ancho, alto } = dimensiones(tarjeta);
  const dimSpec =
    DIMENSIONES.find((d) => d.id === tarjeta.dimension) ?? DIMENSIONES[0];

  function deseleccionar() {
    if (onSeleccionar) onSeleccionar(null);
  }

  return (
    <div
      ref={ref}
      data-lienzo
      onPointerDown={deseleccionar}
      style={{
        width: ancho,
        height: alto,
        transform: `rotate(${tarjeta.rotacionTarjeta}deg)`,
        transition: "transform 0.3s ease, filter 0.4s ease",
        ...estiloMarco(tarjeta),
        ...bordeForma(tarjeta),
        fontFamily: "var(--font-cuerpo)",
        position: "relative",
        overflow: tarjeta.forma === "circular" ? "hidden" : "visible",
        display: "flex",
        flexDirection: "column",
        filter: dimSpec.filter,
      }}
    >
      {/* Overlay de la dimensión (encima de TODO, sin bloquear el
          pointer). Se incluye en la captura PNG porque vive dentro del
          lienzo. */}
      {dimSpec.overlay && (
        <div
          aria-hidden="true"
          className={`overlay-dimension overlay-${dimSpec.overlay}`}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            ...bordeForma(tarjeta),
          }}
        />
      )}

      {/* Texto superior */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          textAlign: "center",
          minHeight: 20,
          opacity: 0.85,
        }}
      >
        {tarjeta.textoSuperior}
      </div>

      {/* Motivo grande */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: tarjeta.orientacion === "horizontal" ? 28 : 34,
          textAlign: "center",
          lineHeight: 1.1,
          margin: "8px 0",
        }}
      >
        {tarjeta.motivo || "Tu tarjeta"}
      </div>

      {/* Foto */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          minHeight: 0,
        }}
      >
        {tarjeta.personaje ? (
          <img
            crossOrigin="anonymous"
            src={tarjeta.personaje.image}
            alt={tarjeta.personaje.name}
            draggable={false}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: tarjeta.forma === "circular" ? "50%" : 8,
              border: "2px solid currentColor",
              filter: "contrast(0.95) saturate(1.05)",
              pointerEvents: "none",
            }}
          />
        ) : (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              opacity: 0.5,
              textAlign: "center",
              padding: 16,
            }}
          >
            (elegí un personaje del catálogo)
          </div>
        )}
      </div>

      {/* Adornos a nivel del lienzo entero (no del wrapper de la foto)
          para que sus coordenadas en % coincidan con el rect que mide
          el drag. */}
      {tarjeta.adornos.map((a) => (
        <AdornoArrastrable
          key={a.id}
          adorno={a}
          seleccionado={a.id === idSeleccionado}
          modoCaptura={modoCaptura}
          onSeleccionar={(id) => onSeleccionar?.(id)}
          onActualizar={(id, cambios) => onActualizarAdorno?.(id, cambios)}
        />
      ))}

      {/* Nombre del personaje */}
      {tarjeta.personaje && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            textAlign: "center",
            marginTop: 8,
            opacity: 0.7,
          }}
        >
          {tarjeta.personaje.name}
        </div>
      )}

      {/* Texto inferior */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          textAlign: "center",
          marginTop: 6,
          minHeight: 20,
          opacity: 0.85,
        }}
      >
        {tarjeta.textoInferior}
      </div>

      {/* Firma en la esquina */}
      {tarjeta.marco !== "rasgado" && (
        <div
          style={{
            position: "absolute",
            bottom: 6,
            right: 10,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            opacity: 0.4,
            letterSpacing: "0.1em",
          }}
        >
          IMPRENTA C-137
        </div>
      )}
    </div>
  );
});

export default LienzoTarjeta;
