const STATS = [
  {
    value: 146,
    label: "Clientes registrados",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M1.5 17.5c0-3.038 2.462-5.5 5.5-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18.5 17.5c0-2.485-2.015-4.5-4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: "#8B5CE8",
    bg: "rgba(107,50,214,0.1)",
  },
  {
    value: 99,
    label: "Bonos pendientes",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 6v4l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: "#D4A827",
    bg: "rgba(212,168,39,0.1)",
  },
  {
    value: 45,
    label: "Bonos canjeados",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6.5 10l3 3 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
  },
  {
    value: 2,
    label: "Sin bono ganado",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="8" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="13" r="1.5" fill="currentColor" />
      </svg>
    ),
    color: "#64748B",
    bg: "rgba(100,116,139,0.1)",
  },
];

const CASINOS = [
  { name: "Mirage Casino Ventura Plaza", count: 51, pct: 36 },
  { name: "Mirage Casino Av. 5",         count: 47, pct: 33 },
  { name: "Mirage Casino Av. 0",         count: 44, pct: 31 },
];

const BONUS_TIERS = [
  { label: "Bono de $10.000",    count: 36, color: "#8B5CE8" },
  { label: "Bono de $20.000",    count: 28, color: "#3A7EF0" },
  { label: "Bono de $50.000",    count: 18, color: "#00C4D8" },
  { label: "Bono de $100.000",   count: 10, color: "#D4A827" },
  { label: "Bono de $500.000",   count: 4,  color: "#F97316" },
  { label: "Gran Premio $1,2M",  count: 2,  color: "#10B981" },
];

const RECENT = [
  { name: "David Ladino",    date: "13 sept 2026", bono: "$50.000" },
  { name: "María González",  date: "13 sept 2026", bono: "$10.000" },
  { name: "Carlos Pérez",    date: "12 sept 2026", bono: "$20.000" },
  { name: "Ana Rodríguez",   date: "12 sept 2026", bono: "$10.000" },
  { name: "Luis Martínez",   date: "11 sept 2026", bono: "$100.000" },
];

const daysLeft = Math.max(0, Math.ceil((new Date("2026-09-30").getTime() - Date.now()) / 86400000));

const card: React.CSSProperties = {
  background: "#0E0B28",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "0.875rem",
  padding: "1.25rem",
};

export default function VistaGeneral() {
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
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2.5" width="11" height="9.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/></svg>
          <span>$1,2M entregados</span>
          <span style={{ color: "rgba(237,232,252,0.2)" }}>·</span>
          <button className="text-xs" style={{ color: "rgba(237,232,252,0.4)" }}>ver por casino</button>
        </div>
      </div>

      {/* Vigencia banner */}
      <div
        className="flex items-center gap-3 px-5 py-3.5 rounded-xl flex-wrap"
        style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.16)" }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
          <rect x="1" y="2.5" width="12" height="10.5" rx="1.5" stroke="#10B981" strokeWidth="1.2" />
          <path d="M4.5 2.5v-1M9.5 2.5v-1M1 6h12" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span className="text-sm" style={{ color: "rgba(237,232,252,0.5)" }}>Vigencia de la promoción</span>
        <span className="text-sm">
          Hasta el <strong style={{ color: "#34D399" }}>30 de septiembre de 2026</strong>
        </span>
        <span style={{ color: "rgba(237,232,252,0.25)" }}>·</span>
        <span className="text-sm" style={{ color: "rgba(237,232,252,0.45)" }}>Quedan {daysLeft} días</span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
        {STATS.map((stat, i) => (
          <div key={i} style={card}>
            <div className="p-2 inline-flex rounded-xl mb-3" style={{ background: stat.bg, color: stat.color }}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{stat.value}</p>
            <p className="text-xs" style={{ color: "rgba(237,232,252,0.4)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Casino distribution */}
      <div style={{ ...card, padding: "1.5rem" }}>
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <h3 className="font-bold text-white text-sm">Reparto de premios generales por casino</h3>
            <p className="text-xs mt-1" style={{ color: "rgba(237,232,252,0.38)" }}>
              El sistema favorece a la sede más atrasada en cada giro para tender a igualarse.
            </p>
          </div>
          <div
            className="text-xs px-3 py-2 rounded-lg text-right"
            style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.18)" }}
          >
            <p className="font-semibold text-xs uppercase tracking-wider" style={{ color: "#A78BFA" }}>
              Bonos promocionales (aparte)
            </p>
            <p className="mt-0.5" style={{ color: "rgba(237,232,252,0.5)" }}>2 cartones · 1 sin redimir</p>
          </div>
        </div>
        <div className="space-y-4">
          {CASINOS.map((c, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm" style={{ color: "rgba(237,232,252,0.7)" }}>{c.name}</span>
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
          Reparto ideal entre 3 casinos: 33% cada uno · 142 premios generales en total
        </p>
      </div>

      {/* Bottom two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div style={card}>
          <h3 className="font-bold text-white text-sm mb-4">Bonos por premio</h3>
          <div className="space-y-0">
            {BONUS_TIERS.map((tier, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2.5"
                style={{ borderBottom: i < BONUS_TIERS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
              >
                <span className="text-sm" style={{ color: "rgba(237,232,252,0.55)" }}>{tier.label}</span>
                <span className="font-bold text-sm" style={{ color: tier.color }}>{tier.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <h3 className="font-bold text-white text-sm mb-4">Últimos registros</h3>
          <div className="space-y-0">
            {RECENT.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2.5"
                style={{ borderBottom: i < RECENT.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: "rgba(237,232,252,0.8)" }}>{r.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(237,232,252,0.3)" }}>{r.date}</p>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(212,168,39,0.1)", color: "#D4A827", border: "1px solid rgba(212,168,39,0.18)" }}
                >
                  {r.bono}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
