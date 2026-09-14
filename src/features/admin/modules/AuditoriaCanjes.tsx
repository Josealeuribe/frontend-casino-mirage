const CANJES = [
  { id: "CJ-001", cliente: "María González", doc: "23.456.789", bono: "$10.000",  cajero: "Sandra Ruiz", sede: "Mirage No. 2", fecha: "13 sept 2026", hora: "10:42" },
  { id: "CJ-002", cliente: "Carlos Pérez",   doc: "34.567.890", bono: "$20.000",  cajero: "Pedro Gómez", sede: "Mirage 3",     fecha: "12 sept 2026", hora: "15:17" },
  { id: "CJ-003", cliente: "Luis Martínez",  doc: "56.789.012", bono: "$50.000",  cajero: "Sandra Ruiz", sede: "Mirage No. 2", fecha: "11 sept 2026", hora: "18:03" },
  { id: "CJ-004", cliente: "Sandra López",   doc: "89.012.345", bono: "$10.000",  cajero: "Ana Vera",    sede: "Mirage 3",     fecha: "10 sept 2026", hora: "12:55" },
  { id: "CJ-005", cliente: "Jorge Sánchez",  doc: "78.901.234", bono: "$20.000",  cajero: "Pedro Gómez", sede: "Mirage 3",     fecha: "09 sept 2026", hora: "20:14" },
];

const card: React.CSSProperties = {
  background: "#0E0B28",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "0.875rem",
};

export default function AuditoriaCanjes() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Auditoría de Canjes</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>
            Registro completo de bonos canjeados
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(237,232,252,0.6)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v8M3.5 6.5l3 3 3-3M1.5 11.5h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Exportar CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3.5">
        {[
          { label: "Total canjeados", value: "45",    color: "#10B981" },
          { label: "Valor total",     value: "$640K", color: "#D4A827" },
          { label: "Tasa de canje",   value: "31%",   color: "#8B5CE8" },
        ].map((kpi, i) => (
          <div key={i} className="rounded-xl p-4 text-center" style={card}>
            <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-xs mt-1" style={{ color: "rgba(237,232,252,0.38)" }}>{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ ...card, overflow: "hidden" }}>
        <table className="w-full text-sm">
          <thead style={{ background: "#0C0924" }}>
            <tr>
              {["ID", "Cliente", "Documento", "Bono", "Cajero", "Sede", "Fecha", "Hora"].map((h) => (
                <th key={h} className="text-left text-xs font-medium px-4 py-3 uppercase tracking-wider whitespace-nowrap" style={{ color: "rgba(237,232,252,0.3)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CANJES.map((c, i, arr) => (
              <tr
                key={c.id}
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                className="transition-colors"
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(107,50,214,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <td className="px-4 py-3 font-mono text-xs" style={{ color: "rgba(237,232,252,0.3)" }}>{c.id}</td>
                <td className="px-4 py-3 font-medium" style={{ color: "rgba(237,232,252,0.85)" }}>{c.cliente}</td>
                <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.4)" }}>{c.doc}</td>
                <td className="px-4 py-3 font-semibold" style={{ color: "#D4A827" }}>{c.bono}</td>
                <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.5)" }}>{c.cajero}</td>
                <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.4)" }}>{c.sede}</td>
                <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "rgba(237,232,252,0.35)" }}>{c.fecha}</td>
                <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.35)" }}>{c.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
