// Skeleton de carga. El shimmer vive en CSS (clase .esqueleto-shimmer)
// así puedo meter 20 instancias sin que JS sufra.
export default function EsqueletoTarjeta() {
  return (
    <li
      aria-hidden="true"
      className="overflow-hidden rounded-lg border border-portal/10 bg-espacio-2/40"
    >
      <div className="esqueleto-shimmer aspect-square w-full" />
      <div className="space-y-2 p-3">
        <div className="esqueleto-shimmer h-5 w-3/4 rounded" />
        <div className="esqueleto-shimmer h-3 w-1/2 rounded" />
        <div className="esqueleto-shimmer h-3 w-2/3 rounded" />
        <div className="esqueleto-shimmer mt-3 h-8 w-full rounded-md" />
      </div>
    </li>
  );
}

// Atajo para no escribir el map cada vez. Va directo dentro de un <ul>.
export function EsqueletosGrilla({ cantidad = 8 }: { cantidad?: number }) {
  return (
    <>
      {Array.from({ length: cantidad }).map((_, i) => (
        <EsqueletoTarjeta key={i} />
      ))}
    </>
  );
}
