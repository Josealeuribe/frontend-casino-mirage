import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { useTituloVista } from "@/shared/hooks/useTituloVista";
import { ApiError, fetchMe, type SafeBono, type SafeCliente } from "@/shared/api/client";
import Sidebar, { MODULES } from "./components/Sidebar";
import { ClienteCargando, ClienteError } from "./ClienteStates";
import Inicio from "./modules/Inicio";
import MiBono from "./modules/MiBono";
import Premios from "./modules/Premios";
import Sedes from "./modules/Sedes";
import Historial from "./modules/Historial";
import MiPerfil from "./modules/MiPerfil";

export default function ClienteLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState("inicio");

  // Se carga una sola vez aquí y se reparte hacia abajo por props -- así
  // cambiar de pestaña (Inicio -> Mi Bono -> Sedes...) no repite la misma
  // llamada a /auth/me. `user.bono` (AuthContext) podría estar desactualizado
  // si un cajero canjeó el bono en otra sesión, así que se refresca con su
  // propio fetchMe() en vez de confiar en el que trae el login.
  const [cliente, setCliente] = useState<SafeCliente | null>(null);
  const [bono, setBono] = useState<SafeBono | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useTituloVista("Mi Cuenta");

  const cargar = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchMe()
      .then((me) => {
        if (me.tipo !== "cliente") return; // no debería pasar: el guard de abajo ya filtró por rol
        setCliente(me.cliente);
        setBono(me.bono);
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : "No se pudo cargar tu información. Intenta de nuevo."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user && user.role === "cliente") cargar();
  }, [user, cargar]);

  // Mismo patrón exacto que AdminLayout: guardas de sesión/rol antes de
  // pintar el panel, con el mismo texto y botón "Ir al inicio".
  if (!user || user.role !== "cliente") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080718" }}>
        <div className="text-center">
          <p className="mb-5 text-sm" style={{ color: "rgba(237,232,252,0.45)" }}>
            {user ? "Esta vista es solo para clientes." : "Debes iniciar sesión para acceder a tu cuenta."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #6B32D6, #1A5ED8)" }}
          >
            Ir al inicio
          </button>
        </div>
      </div>
    );
  }

  const activeLabel = MODULES.find((m) => m.id === activeModule)?.label ?? "Mi Cuenta";

  const MODULE_COMPONENTS: Record<string, React.ReactNode> = {
    inicio: <Inicio cliente={cliente} bono={bono} onNavigate={setActiveModule} />,
    "mi-bono": <MiBono bono={bono} onNavigate={setActiveModule} />,
    premios: <Premios />,
    sedes: <Sedes />,
    historial: <Historial />,
    "mi-perfil": <MiPerfil cliente={cliente} />,
  };

  // Antes de tener el primer fetchMe() resuelto, ningún módulo tiene datos
  // reales que mostrar -- se muestra carga/error a pantalla completa. Una
  // vez que "cliente" llegó por primera vez, cambiar de pestaña ya no vuelve
  // a mostrar el loader completo (solo lo haría un refetch explícito).
  const mostrarEstadoGlobal = !cliente && (loading || error);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#080718" }}>
      <Sidebar active={activeModule} onSelect={setActiveModule} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header
          className="flex items-center justify-between px-6 h-14 flex-shrink-0"
          style={{
            background: "#0C0924",
            borderBottom: "1px solid rgba(107,50,214,0.12)",
          }}
        >
          <h2 className="font-semibold text-sm" style={{ color: "rgba(237,232,252,0.85)" }}>
            {activeLabel}
          </h2>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
              style={{ color: "rgba(237,232,252,0.5)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#EDE8FC"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.5)"; }}
            >
              <ChevronLeft size={14} />
              Volver a Inicio
            </Link>

            {/* User pill */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{ border: "1px solid rgba(107,50,214,0.2)", color: "rgba(237,232,252,0.65)", background: "rgba(107,50,214,0.06)" }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "linear-gradient(135deg,#6B32D6,#1A5ED8)", color: "#fff", fontSize: "10px" }}
              >
                {user.name[0]}
              </div>
              {user.name}
            </div>
          </div>
        </header>

        {/* Module content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ background: "#080718" }}>
          {mostrarEstadoGlobal ? (
            loading ? <ClienteCargando label="Cargando tu cuenta..." /> : <ClienteError message={error ?? "No se pudo cargar tu información."} onRetry={cargar} />
          ) : (
            MODULE_COMPONENTS[activeModule] ?? <Inicio cliente={cliente} bono={bono} onNavigate={setActiveModule} />
          )}
        </main>
      </div>
    </div>
  );
}
