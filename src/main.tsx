// Punto de entrada. Monto React adentro de #root, envuelvo con el Router
// y cargo el CSS global acá una sola vez (que no ande importado en mil
// componentes ensuciando el bundle).
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./estilos/global.css";
import App from "./App";

// El "!" es porque sé que #root existe (lo declaro en index.html).
// Si algún día no está, prefiero que explote acá con un null deref
// claro antes que tener que cazar un undefined diez stacks más abajo.
// Los future flags v7 del Router silencian los warnings y me dejan
// la migración a v7 pronta para cuando me dé la nafta.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter
      basename={import.meta.env.BASE_URL}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </BrowserRouter>
  </StrictMode>
);
