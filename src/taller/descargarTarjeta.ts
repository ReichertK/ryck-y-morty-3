// Convierte el lienzo a PNG y dispara la descarga. Uso html-to-image
// porque renderea con CSS real, banca SVG inline y la API de R&M
// permite cargar avatares sin headers raros de CORS.
import { toPng } from "html-to-image";

// pixelRatio 2.5 → imagen final con el doble de detalle. Si alguien
// quiere imprimirla, no se le ve pixelada; si la sube a Instagram,
// tampoco se le degrada con la recompresión.
export async function descargarTarjeta(
  nodo: HTMLElement,
  nombreArchivo = "tarjeta-c137.png"
): Promise<void> {
  const dataUrl = await toPng(nodo, {
    pixelRatio: 2.5,
    cacheBust: true,
    backgroundColor: undefined, // mantengo transparencia si el marco la pide
  });

  // Truco viejo: <a download> + click programado + remove. No hay una
  // API más linda hoy para gatillar descargas desde el cliente.
  const enlace = document.createElement("a");
  enlace.download = nombreArchivo;
  enlace.href = dataUrl;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
}
