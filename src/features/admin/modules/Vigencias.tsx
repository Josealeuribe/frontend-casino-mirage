const card: React.CSSProperties = {
  background: "#0E0B28",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "0.875rem",
};

export default function Vigencias() {
  const start = new Date("2026-09-01");
  const end   = new Date("2026-09-30");
  const now   = new Date();
  const pct   = Math.min(100, Math.max(0, ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100));
  const daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86400000));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Vigencias</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>Control de fechas de la promoción activa</p>
      </div>

      {/* Main campaign card */}
      <div style={{ ...card, padding: "1.5rem", border: "1px solid rgba(107,50,214,0.25)" }}>
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <span
              className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
              style={{ background: "rgba(16,185,129,0.1)", color: "#34D399", border: "1px solid rgba(16,185,129,0.18)" }}
            >
              Activa
            </span>
            <h2 className="text-xl font-bold text-white mt-3">Gira y Gana — Temporada 1</h2>
            <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>
              Promoción de bienvenida con ruleta de premios
            </p>
          </div>
          <div className="text-right">
            <p
              className="text-5xl font-black"
              style={{ color: daysLeft <= 7 ? "#F87171" : "#D4A827", lineHeight: 1 }}
            >
              {daysLeft}
            </p>
            <p className="text-xs mt-1" style={{ color: "rgba(237,232,252,0.35)" }}>días restantes</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs" style={{ color: "rgba(237,232,252,0.3)" }}>
            <span>1 sept 2026</span>
            <span>30 sept 2026</span>
          </div>
          <div className="w-full rounded-full h-2" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, background: "linear-gradient(90deg,#6B32D6,#00C4D8)" }}
            />
          </div>
          <p className="text-xs" style={{ color: "rgba(237,232,252,0.28)" }}>{pct.toFixed(0)}% transcurrido</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { label: "Inicio",    value: "01 sept 2026" },
            { label: "Fin",       value: "30 sept 2026" },
            { label: "Duración",  value: "30 días" },
          ].map((item, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-xs mb-1" style={{ color: "rgba(237,232,252,0.3)" }}>{item.label}</p>
              <p className="text-sm font-medium" style={{ color: "rgba(237,232,252,0.8)" }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div style={{ ...card, padding: "1.25rem" }}>
        <h3 className="font-bold text-white text-sm mb-4">Historial de promociones</h3>
        <div className="space-y-0">
          {[
            { name: "Verano de Premios",  periodo: "Jul – Ago 2026", total: "$800K" },
            { name: "Carnaval de Bonos",  periodo: "Mar – Abr 2026", total: "$1,1M" },
            { name: "Año Nuevo de Lujo",  periodo: "Dic 2025 – Ene 2026", total: "$1,4M" },
          ].map((p, i, arr) => (
            <div
              key={i}
              className="flex items-center justify-between py-3.5"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: "rgba(237,232,252,0.7)" }}>{p.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(237,232,252,0.3)" }}>{p.periodo}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold" style={{ color: "#D4A827" }}>{p.total}</p>
                <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: "rgba(100,116,139,0.12)", color: "#94A3B8" }}>
                  Finalizada
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
