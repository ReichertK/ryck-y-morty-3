import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Vite + React + Tailwind v4. El plugin de Tailwind reemplaza
// al viejo PostCSS — ahora es una sola línea.
//
// `base` se usa cuando publicamos en GitHub Pages bajo
// https://<user>.github.io/<repo>/ — así los assets resuelven bien.
// En dev (`npm run dev`) Vite ignora `base` y todo sirve desde `/`.
export default defineConfig({
  base: "/ryck-y-morty-3/",
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    // Source maps off en producción → bundle más liviano para Pages.
    sourcemap: false,
    rollupOptions: {
      output: {
        // Separo manualmente los chunks grandes para que el navegador
        // pueda cachear `vendor-react` largamente (cambia poco), y para
        // que `html-to-image` (pesado) viva en su propio archivo y solo
        // se descargue cuando el usuario abre el Taller.
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-icons": ["lucide-react"],
          "vendor-export": ["html-to-image"],
        },
      },
    },
  },
});
