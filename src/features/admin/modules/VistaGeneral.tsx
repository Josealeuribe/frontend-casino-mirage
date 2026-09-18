import { Users, Clock, CheckCircle2, Lock, Banknote, Calendar } from "lucide-react";
import { adminFetchVistaGeneral } from "@/shared/api/client";
import { useAdminFetch } from "../useAdminFetch";
import { AdminCargando, AdminError } from "../AdminStates";

const STAT_META = [
  {
    key: "clientesRegistrados" as const,
    label: "Clientes registrados",
    icon: <Users size={20} />,
    color: "#8B5CE8",
    bg: "rgba(107,50,214,0.1)",
  },
  {
    key: "bonosPendientes" as const,
    label: "Bonos pendientes",
    icon: <Clock size={20} />,
    color: "#D4A827",
    bg: "rgba(212,168,39,0.1)",
  },
  {
    key: "bonosCanjeados" as const,
    label: "Bonos canjeados",
    icon: <CheckCircle2 size={20} />,
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
  },
  {
    key: "sinBono" as const,
    label: "Sin bono ganado",
    icon: <Lock size={20} />,
    color: "#64748B",
    bg: "rgba(100,116,139,0.1)",
  },
];

const TIER_COLORS = ["#8B5CE8", "#3A7EF0", "#D4A827", "#00C4D8", "#10B981"];

const card: React.CSSProperties = {
  background: "#0E0B28",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "0.875rem",
  padding: "1.25rem",
};

// timeZone fija: sin esto, la fecha se formatea con la zona horaria del
// navegador de quien mire la pantalla, no la de Colombia -- una vigencia que
// vence a las 23:59:59 hora Colombia puede leerse como el dia siguiente para
// alguien en una zona horaria mas adelantada.
function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Bogota" });
}

export default function VistaGeneral() {
  const { data, loading, error } = useAdminFetch(adminFetchVistaGeneral);

  if (loading) return <AdminCargando />;
  if (error) return <AdminError message={error} />;
  if (!data) return null;

  const { stats, valorTotalEntregado, repartoPorCasino, bonosPorPremio, ultimosRegistros, vigenciaProxima } = data;
  const totalReparto = repartoPorCasino.reduce((a, c) => a + c.count, 0);
  const daysLeft = vigenciaProxima
    ? Math.max(0, Math.ceil((new Date(vigenciaProxima).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Vista General</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>
            Estado real de la promoción "Gira y Gana"
          </p>
        </div>
        <div
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-full"
          style={{ background: "rgba(212,168,39,0.08)", border: "1px solid rgba(212,168,39,0.2)", color: "#D4A827" }}
        >
          <Banknote size={13} />
          <span>${valorTotalEntregado.toLocaleString("es-CO")} entregados</span>
        </div>
      </div>

      {/* Vigencia banner */}
      {vigenciaProxima && (
        <div
          className="flex items-center gap-3 px-5 py-3.5 rounded-xl flex-wrap"
          style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.16)" }}
        >
          <Calendar size={14} className="flex-shrink-0" style={{ color: "#10B981" }} />
          <span className="text-sm" style={{ color: "rgba(237,232,252,0.5)" }}>Vigencia próxima a vencer</span>
          <span className="text-sm">
            Hasta el <strong style={{ color: "#34D399" }}>{formatFecha(vigenciaProxima)}</strong>
          </span>
          <span style={{ color: "rgba(237,232,252,0.25)" }}>·</span>
          <span className="text-sm" style={{ color: "rgba(237,232,252,0.45)" }}>Quedan {daysLeft} días</span>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
        {STAT_META.map((stat, i) => (
          <div key={i} style={card}>
            <div className="p-2 inline-flex rounded-xl mb-3" style={{ background: stat.bg, color: stat.color }}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{stats[stat.key]}</p>
            <p className="text-xs" style={{ color: "rgba(237,232,252,0.4)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Casino distribution */}
      <div style={{ ...card, padding: "1.5rem" }}>
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <h3 className="font-bold text-white text-sm">Reparto de premios generales por sede</h3>
            <p className="text-xs mt-1" style={{ color: "rgba(237,232,252,0.38)" }}>
              El sistema favorece a la sede más atrasada en cada giro para tender a igualarse.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {repartoPorCasino.map((c, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm" style={{ color: "rgba(237,232,252,0.7)" }}>{c.sede}</span>
                <span className="text-xs">
                  <span className="text-white font-medium">{c.count}</span>
                  <span style={{ color: "rgba(237,232,252,0.35)" }}> · {c.pct}%</span>
                </span>
              </div>
              <div className="w-full rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${c.pct}%`, background: "linear-gradient(90deg,#6B32D6,#00C4D8)" }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs mt-4" style={{ color: "rgba(237,232,252,0.2)" }}>
          Reparto ideal entre 2 sedes: 50% cada una · {totalReparto} premios generales en total
        </p>
      </div>

      {/* Bottom two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div style={card}>
          <h3 className="font-bold text-white text-sm mb-4">Bonos por premio</h3>
          <div className="space-y-0">
            {bonosPorPremio.map((tier, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2.5"
                style={{ borderBottom: i < bonosPorPremio.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
              >
                <span className="text-sm" style={{ color: "rgba(237,232,252,0.55)" }}>{tier.premio}</span>
                <span className="font-bold text-sm" style={{ color: TIER_COLORS[i % TIER_COLORS.length] }}>{tier.count}</span>
              </div>
            ))}
            {bonosPorPremio.length === 0 && (
              <p className="text-sm py-4" style={{ color: "rgba(237,232,252,0.3)" }}>Sin datos todavía.</p>
            )}
          </div>
        </div>

        <div style={card}>
          <h3 className="font-bold text-white text-sm mb-4">Últimos registros</h3>
          <div className="space-y-0">
            {ultimosRegistros.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2.5"
                style={{ borderBottom: i < ultimosRegistros.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: "rgba(237,232,252,0.8)" }}>{r.nombre}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(237,232,252,0.3)" }}>{formatFecha(r.fecha)}</p>
                </div>
                {r.bono ? (
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(212,168,39,0.1)", color: "#D4A827", border: "1px solid rgba(212,168,39,0.18)" }}
                  >
                    ${r.bono.monto.toLocaleString("es-CO")}
                  </span>
                ) : (
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(100,116,139,0.1)", color: "#94A3B8", border: "1px solid rgba(100,116,139,0.15)" }}
                  >
                    Sin bono
                  </span>
                )}
              </div>
            ))}
            {ultimosRegistros.length === 0 && (
              <p className="text-sm py-4" style={{ color: "rgba(237,232,252,0.3)" }}>Sin registros todavía.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
