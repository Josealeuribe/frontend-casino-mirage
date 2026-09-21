import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";

/** Reemplaza la página de error genérica de React Router (en inglés, con el
 *  stack trace crudo a la vista) por una en español acorde al resto del
 *  sitio. Se activa ante cualquier error no controlado al renderizar una
 *  ruta -- incluyendo el típico choque entre el traductor automático del
 *  navegador y React (ver nota en index.html) -- y ofrece recargar en vez
 *  de dejar a quien visita varado frente a un stack trace. */
export default function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  const mensaje = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : "Ocurrió un problema al mostrar esta página.";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: "#0B0818", color: "#EDE8FC" }}
    >
      <h1 className="text-2xl font-bold mb-2">Algo salió mal</h1>
      <p className="text-sm mb-6 max-w-sm" style={{ color: "rgba(237,232,252,0.55)" }}>
        {mensaje} Intenta recargar la página; si sigue pasando, vuelve al inicio.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg,#6B32D6,#1A5ED8)" }}
        >
          Recargar página
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(237,232,252,0.8)" }}
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
}
