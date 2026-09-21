import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Home, Store, Calendar, Menu } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { useTituloVista } from "@/shared/hooks/useTituloVista";
import { fetchVigenciaPromocion } from "@/shared/api/client";
import CambiarPasswordObligatorioModal from "@/shared/components/CambiarPasswordObligatorioModal";
import Sidebar, { MODULES } from "./components/Sidebar";
import CanjearCodigo from "./CanjearCodigo";
import BuscarCedula from "./BuscarCedula";
import Historial from "./Historial";
import Vigencias from "./Vigencias";
import MiCuenta from "./MiCuenta";

const MODULE_COMPONENTS: Record<string, React.ReactNode> = {
  "canjear-codigo": <CanjearCodigo />,
  "buscar-cedula": <BuscarCedula />,
  "mis-canjes": <Historial />,
  vigencias: <Vigencias />,
  "mi-cuenta": <MiCuenta />,
};

export default function CajeroLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState("canjear-codigo");
  const [vigenciaHasta, setVigenciaHasta] = useState<Date | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useTituloVista("Mostrador de canjes");

  // Banner de vigencia: mismo endpoint público y mismo formateo que ya usa
  // RuletaPage, para que la fecha se vea igual en todo el sitio.
  useEffect(() => {
    let cancelado = false;
    fetchVigenciaPromocion()
      .then((r) => {
        if (cancelado) return;
        setVigenciaHasta(r.vigenciaHasta ? new Date(r.vigenciaHasta) : null);
      })
      .catch(() => {
        // Silencioso a propósito: si falla, simplemente no se muestra el
        // banner de vigencia -- no es crítico para operar el mostrador.
      });
    return () => { cancelado = true; };
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080718" }}>
        <div className="text-center">
          <p className="mb-5 text-sm" style={{ color: "rgba(237,232,252,0.45)" }}>
            Debes iniciar sesión para acceder al mostrador de canjes.
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

  // El backend deja pasar tanto a "cajero" como a "admin" (un admin también
  // puede atender el mostrador), así que el guard espeja exactamente eso.
  if (user.role !== "cajero" && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080718" }}>
        <div className="text-center">
          <p className="mb-5 text-sm" style={{ color: "rgba(237,232,252,0.45)" }}>
            Tu cuenta no tiene acceso al mostrador de canjes.
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

  // Un admin usando este mostrador no tiene sede propia (user.sede es null):
  // el fallback evita mostrar "null / null" y explica que aplica a todas.
  const sedeLabel = user.sede ? user.sede.nombre : "Centro Club Mirage — Todas las sedes";
  const sedeDireccion = user.sede?.direccion ?? null;

  const activeLabel = MODULES.find((m) => m.id === activeModule)?.label ?? "Mostrador";

  const daysLeft = vigenciaHasta ? Math.max(0, Math.ceil((vigenciaHasta.getTime() - Date.now()) / 86400000)) : null;
  // timeZone fija a Colombia -- ver la misma nota en admin/modules/VistaGeneral.tsx.
  const vigenciaLabel = vigenciaHasta
    ? vigenciaHasta.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Bogota" })
    : null;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#080718" }}>
      {user.debeCambiarPassword && <CambiarPasswordObligatorioModal />}
      <Sidebar
        active={activeModule}
        onSelect={setActiveModule}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header
          className="flex items-center justify-between gap-3 px-4 md:px-6 h-14 flex-shrink-0"
          style={{ background: "#0C0924", borderBottom: "1px solid rgba(107,50,214,0.12)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ color: "rgba(237,232,252,0.65)", background: "rgba(107,50,214,0.08)" }}
              aria-label="Abrir menú"
            >
              <Menu size={17} />
            </button>
            <h2 className="font-semibold text-sm truncate" style={{ color: "rgba(237,232,252,0.85)" }}>
              {activeLabel}
            </h2>
          </div>
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs flex-shrink-0"
            style={{ border: "1px solid rgba(107,50,214,0.2)", color: "rgba(237,232,252,0.65)", background: "rgba(107,50,214,0.06)" }}
          >
            <Home size={14} strokeWidth={1.3} />
            Hola, {user.name}
          </div>
        </header>

        {/* Banner de sede -- persistente en las 5 secciones, porque el
            cajero siempre necesita saber a nombre de qué sede queda el
            canje que está por confirmar. */}
        <div
          className="flex flex-wrap items-center justify-between gap-2 px-4 md:px-6 py-3 flex-shrink-0"
          style={{ background: "#0C0924", borderBottom: "1px solid rgba(107,50,214,0.1)" }}
        >
          <div className="flex items-center gap-2.5 flex-wrap">
            <Store size={15} strokeWidth={1.3} style={{ color: "rgba(237,232,252,0.4)", flexShrink: 0 }} />
            <strong className="text-sm" style={{ color: "rgba(237,232,252,0.85)" }}>{sedeLabel}</strong>
            {sedeDireccion && (
              <span className="text-xs" style={{ color: "rgba(237,232,252,0.4)" }}>{sedeDireccion}</span>
            )}
          </div>
          <span className="text-xs" style={{ color: "rgba(237,232,252,0.3)" }}>
            Los canjes quedan a nombre de esta sede
          </span>
        </div>

        {/* Banner de vigencia -- misma familia visual verde que el resto del
            sitio, también persistente en las 5 secciones. */}
        {vigenciaLabel && (
          <div
            className="flex flex-wrap items-center gap-2 px-4 md:px-6 py-2.5 flex-shrink-0"
            style={{ background: "rgba(16,185,129,0.06)", borderBottom: "1px solid rgba(16,185,129,0.16)" }}
          >
            <Calendar size={14} strokeWidth={1.1} style={{ color: "#10B981", flexShrink: 0 }} />
            <span className="text-xs" style={{ color: "rgba(237,232,252,0.45)" }}>Vigencia de la promoción</span>
            <strong className="text-sm" style={{ color: "#34D399" }}>
              Hasta el {vigenciaLabel} · Quedan {daysLeft} {daysLeft === 1 ? "día" : "días"}
            </strong>
          </div>
        )}

        {/* Module content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6" style={{ background: "#080718" }}>
          {MODULE_COMPONENTS[activeModule] ?? <CanjearCodigo />}
        </main>
      </div>
    </div>
  );
}
