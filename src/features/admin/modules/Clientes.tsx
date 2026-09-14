import { useState } from "react";

const ALL_CLIENTS = [
  { id: "001", name: "David Ladino",   doc: "12.345.678", sede: "Ventura Plaza", giros: 3, bono: "$50.000",    estado: "Pendiente", fecha: "13 sept 2026" },
  { id: "002", name: "María González", doc: "23.456.789", sede: "Av. 5",         giros: 2, bono: "$10.000",    estado: "Canjeado",  fecha: "13 sept 2026" },
  { id: "003", name: "Carlos Pérez",   doc: "34.567.890", sede: "Av. 0",         giros: 3, bono: "$20.000",    estado: "Canjeado",  fecha: "12 sept 2026" },
  { id: "004", name: "Ana Rodríguez",  doc: "45.678.901", sede: "Ventura Plaza", giros: 1, bono: "$10.000",    estado: "Pendiente", fecha: "12 sept 2026" },
  { id: "005", name: "Luis Martínez",  doc: "56.789.012", sede: "Av. 5",         giros: 3, bono: "$100.000",   estado: "Canjeado",  fecha: "11 sept 2026" },
  { id: "006", name: "Paola Torres",   doc: "67.890.123", sede: "Av. 0",         giros: 2, bono: "$20.000",    estado: "Pendiente", fecha: "11 sept 2026" },
  { id: "007", name: "Jorge Sánchez",  doc: "78.901.234", sede: "Ventura Plaza", giros: 3, bono: "$500.000",   estado: "Pendiente", fecha: "10 sept 2026" },
  { id: "008", name: "Sandra López",   doc: "89.012.345", sede: "Av. 5",         giros: 3, bono: "$10.000",    estado: "Canjeado",  fecha: "10 sept 2026" },
];

const card: React.CSSProperties = {
  background: "#0E0B28",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "0.875rem",
  overflow: "hidden",
};

export default function Clientes() {
  const [search, setSearch] = useState("");
  const filtered = ALL_CLIENTS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.doc.includes(search)
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>
            {ALL_CLIENTS.length} clientes registrados en la promoción
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: "linear-gradient(135deg,#6B32D6,#1A5ED8)", color: "#fff" }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          Agregar cliente
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(237,232,252,0.3)" }}>
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Buscar por nombre o documento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm outline-none rounded-xl"
          style={{
            background: "#0E0B28",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "rgba(237,232,252,0.8)",
          }}
          onFocus={(e) => { e.target.style.borderColor = "rgba(107,50,214,0.45)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }}
        />
      </div>

      {/* Table */}
      <div style={card}>
        <table className="w-full text-sm">
          <thead style={{ background: "#0C0924" }}>
            <tr>
              {["#", "Nombre", "Documento", "Sede", "Giros", "Bono", "Estado", "Fecha"].map((h) => (
                <th key={h} className="text-left text-xs font-medium px-4 py-3 uppercase tracking-wider" style={{ color: "rgba(237,232,252,0.3)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr
                key={c.id}
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                className="transition-colors"
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(107,50,214,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.25)" }}>{c.id}</td>
                <td className="px-4 py-3 font-medium" style={{ color: "rgba(237,232,252,0.85)" }}>{c.name}</td>
                <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.4)" }}>{c.doc}</td>
                <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.4)" }}>{c.sede}</td>
                <td className="px-4 py-3 text-center text-xs" style={{ color: "rgba(237,232,252,0.55)" }}>{c.giros}/3</td>
                <td className="px-4 py-3 font-semibold text-sm" style={{ color: "#D4A827" }}>{c.bono}</td>
                <td className="px-4 py-3">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={
                      c.estado === "Canjeado"
                        ? { background: "rgba(16,185,129,0.1)", color: "#34D399", border: "1px solid rgba(16,185,129,0.15)" }
                        : { background: "rgba(212,168,39,0.1)", color: "#D4A827",  border: "1px solid rgba(212,168,39,0.18)" }
                    }
                  >
                    {c.estado}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.3)" }}>{c.fecha}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm" style={{ color: "rgba(237,232,252,0.28)" }}>
                  Sin resultados para "{search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
