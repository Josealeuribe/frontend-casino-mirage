const PERSONAL = [
  { id: "P01", nombre: "Sandra Ruiz",    rol: "Cajera",       sede: "Av. 5",         canjes: 18, turno: "Mañana",   estado: "Activo" },
  { id: "P02", nombre: "Pedro Gómez",    rol: "Cajero",       sede: "Av. 0",         canjes: 15, turno: "Tarde",    estado: "Activo" },
  { id: "P03", nombre: "Ana Vera",       rol: "Supervisora",  sede: "Ventura Plaza", canjes: 12, turno: "Completo", estado: "Activo" },
  { id: "P04", nombre: "Miguel Torres",  rol: "Cajero",       sede: "Ventura Plaza", canjes: 8,  turno: "Noche",    estado: "Activo" },
  { id: "P05", nombre: "Laura Jiménez",  rol: "Cajera",       sede: "Av. 5",         canjes: 5,  turno: "Mañana",   estado: "Inactivo" },
];

const AVATAR_COLORS = ["#6B32D6","#1A5ED8","#00C4D8","#10B981","#D4A827"];

const card: React.CSSProperties = {
  background: "#0E0B28",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "0.875rem",
};

export default function Personal() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Personal</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>Gestión de cajeros y supervisores</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: "rgba(107,50,214,0.12)", border: "1px solid rgba(107,50,214,0.28)", color: "#C4B5FD" }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          Agregar miembro
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3.5">
        {[
          { label: "Total personal",      value: PERSONAL.length },
          { label: "Activos",             value: PERSONAL.filter((p) => p.estado === "Activo").length },
          { label: "Canjes procesados",   value: PERSONAL.reduce((a, p) => a + p.canjes, 0) },
        ].map((kpi, i) => (
          <div key={i} className="rounded-xl p-4 text-center" style={card}>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            <p className="text-xs mt-1" style={{ color: "rgba(237,232,252,0.38)" }}>{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PERSONAL.map((p, idx) => (
          <div
            key={p.id}
            className="rounded-2xl p-5 transition-all duration-200"
            style={card}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(107,50,214,0.28)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}, ${AVATAR_COLORS[(idx + 1) % AVATAR_COLORS.length]})` }}
                >
                  {p.nombre.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "rgba(237,232,252,0.88)" }}>{p.nombre}</p>
                  <p className="text-xs" style={{ color: "rgba(237,232,252,0.38)" }}>{p.rol}</p>
                </div>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full"
                style={p.estado === "Activo"
                  ? { background: "rgba(16,185,129,0.1)", color: "#34D399" }
                  : { background: "rgba(100,116,139,0.1)", color: "#94A3B8" }
                }
              >
                {p.estado}
              </span>
            </div>
            <div className="space-y-2">
              {[
                { label: "Sede",               value: p.sede },
                { label: "Turno",              value: p.turno },
                { label: "Canjes procesados",  value: p.canjes },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span style={{ color: "rgba(237,232,252,0.3)" }}>{item.label}</span>
                  <span className="font-medium" style={{ color: "rgba(237,232,252,0.65)" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
