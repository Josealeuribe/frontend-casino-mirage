const WEEKLY = [
  { day: "Lun", giros: 18, canjes: 6 },
  { day: "Mar", giros: 24, canjes: 9 },
  { day: "Mié", giros: 31, canjes: 14 },
  { day: "Jue", giros: 22, canjes: 8 },
  { day: "Vie", giros: 38, canjes: 17 },
  { day: "Sáb", giros: 45, canjes: 22 },
  { day: "Dom", giros: 29, canjes: 11 },
];

const max = Math.max(...WEEKLY.map((w) => w.giros));

const card: React.CSSProperties = {
  background: "#0E0B28",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "0.875rem",
};

export default function Dashboard() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>Actividad y métricas de la semana</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {[
          { label: "Giros hoy",       value: "29",  delta: "+12%", up: true },
          { label: "Canjes hoy",      value: "11",  delta: "+5%",  up: true },
          { label: "Tasa de canje",   value: "31%", delta: "-2%",  up: false },
          { label: "Valor entregado", value: "$380K", delta: "+18%", up: true },
        ].map((kpi, i) => (
          <div key={i} style={{ ...card, padding: "1.25rem" }}>
            <p className="text-xs mb-2" style={{ color: "rgba(237,232,252,0.4)" }}>{kpi.label}</p>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            <span
              className="text-xs font-medium mt-1 inline-flex items-center gap-1"
              style={{ color: kpi.up ? "#10B981" : "#F87171" }}
            >
              {kpi.up ? "↑" : "↓"} {kpi.delta}
            </span>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ ...card, padding: "1.5rem" }}>
        <h3 className="font-bold text-white text-sm mb-6">Giros vs. Canjes — últimos 7 días</h3>
        <div className="flex items-end gap-2.5" style={{ height: 140 }}>
          {WEEKLY.map((w, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex gap-1 items-end" style={{ height: 118 }}>
                <div
                  className="flex-1 rounded-t-md"
                  style={{
                    height: `${(w.giros / max) * 100}%`,
                    background: "linear-gradient(180deg, #6B32D6 0%, #1A5ED8 100%)",
                    opacity: 0.8,
                    minHeight: 4,
                  }}
                  title={`Giros: ${w.giros}`}
                />
                <div
                  className="flex-1 rounded-t-md"
                  style={{
                    height: `${(w.canjes / max) * 100}%`,
                    background: "#00C4D8",
                    opacity: 0.75,
                    minHeight: 4,
                  }}
                  title={`Canjes: ${w.canjes}`}
                />
              </div>
              <span className="text-xs" style={{ color: "rgba(237,232,252,0.3)" }}>{w.day}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6 mt-4">
          <span className="flex items-center gap-2 text-xs" style={{ color: "rgba(237,232,252,0.45)" }}>
            <span className="w-3 h-2 rounded-sm inline-block" style={{ background: "linear-gradient(90deg,#6B32D6,#1A5ED8)" }} />
            Giros
          </span>
          <span className="flex items-center gap-2 text-xs" style={{ color: "rgba(237,232,252,0.45)" }}>
            <span className="w-3 h-2 rounded-sm inline-block" style={{ background: "#00C4D8" }} />
            Canjes
          </span>
        </div>
      </div>

      {/* Table */}
      <div style={{ ...card, padding: "1.25rem" }}>
        <h3 className="font-bold text-white text-sm mb-4">Rendimiento por sede</h3>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Sede", "Giros", "Canjes", "Tasa", "Valor"].map((h) => (
                <th key={h} className="text-left text-xs font-medium pb-3 pr-5 uppercase tracking-wider" style={{ color: "rgba(237,232,252,0.3)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { sede: "Ventura Plaza", giros: 51, canjes: 21, tasa: "41%", valor: "$540K" },
              { sede: "Av. 5",         giros: 47, canjes: 14, tasa: "30%", valor: "$380K" },
              { sede: "Av. 0",         giros: 44, canjes: 10, tasa: "23%", valor: "$280K" },
            ].map((row, i, arr) => (
              <tr key={i} style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <td className="py-3 pr-5" style={{ color: "rgba(237,232,252,0.7)" }}>{row.sede}</td>
                <td className="py-3 pr-5" style={{ color: "rgba(237,232,252,0.5)" }}>{row.giros}</td>
                <td className="py-3 pr-5" style={{ color: "rgba(237,232,252,0.5)" }}>{row.canjes}</td>
                <td className="py-3 pr-5 font-medium" style={{ color: "#10B981" }}>{row.tasa}</td>
                <td className="py-3 pr-5 font-medium" style={{ color: "#D4A827" }}>{row.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
