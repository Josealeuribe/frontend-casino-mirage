import { useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/features/auth/AuthContext";
import { useTituloVista } from "@/shared/hooks/useTituloVista";
import CambiarPasswordObligatorioModal from "@/shared/components/CambiarPasswordObligatorioModal";
import Sidebar, { MODULES } from "./components/Sidebar";
import VistaGeneral from "./modules/VistaGeneral";
import Dashboard from "./modules/Dashboard";
import Clientes from "./modules/Clientes";
import AuditoriaCanjes from "./modules/AuditoriaCanjes";
import Vigencias from "./modules/Vigencias";
import Campanas from "./modules/Campanas";
import Personal from "./modules/Personal";
import MiCuenta from "./modules/MiCuenta";

const MODULE_COMPONENTS: Record<string, React.ReactNode> = {
  "vista-general": <VistaGeneral />,
  dashboard: <Dashboard />,
  clientes: <Clientes />,
  auditoria: <AuditoriaCanjes />,
  vigencias: <Vigencias />,
  campanas: <Campanas />,
  personal: <Personal />,
  "mi-cuenta": <MiCuenta />,
};

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState("vista-general");

  useTituloVista("Panel admin");

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080718" }}>
        <div className="text-center">
          <p className="mb-5 text-sm" style={{ color: "rgba(237,232,252,0.45)" }}>
            {user ? "Tu cuenta no tiene acceso al panel de administración." : "Debes iniciar sesión para acceder al panel."}
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

  const activeLabel = MODULES.find((m) => m.id === activeModule)?.label ?? "Panel";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#080718" }}>
      {user.debeCambiarPassword && <CambiarPasswordObligatorioModal />}
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
          <div className="flex items-center gap-2.5">
            {/* Notification dot */}
            <button
              className="relative w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{ background: "rgba(107,50,214,0.08)", color: "rgba(237,232,252,0.45)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(107,50,214,0.18)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(107,50,214,0.08)"; }}
            >
              <Bell size={15} />
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: "#6B32D6" }}
              />
            </button>

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
              Hola, {user.name}
            </div>
          </div>
        </header>

        {/* Module content */}
        <main
          className="flex-1 overflow-y-auto p-6"
          style={{ background: "#080718" }}
        >
          {MODULE_COMPONENTS[activeModule] ?? <VistaGeneral />}
        </main>
      </div>
    </div>
  );
}
