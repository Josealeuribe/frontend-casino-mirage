import { useState } from "react";

const CAMPANAS = [
  { id: 1, nombre: "Gira y Gana",       tipo: "Ruleta",  estado: "Activa",    inicio: "01 sept 2026", fin: "30 sept 2026", participantes: 146, presupuesto: "$1,2M" },
  { id: 2, nombre: "Verano de Premios", tipo: "Sorteo",  estado: "Finalizada",inicio: "01 jul 2026",  fin: "31 ago 2026",  participantes: 312, presupuesto: "$800K" },
  { id: 3, nombre: "Carnaval de Bonos", tipo: "Ruleta",  estado: "Finalizada",inicio: "15 mar 2026",  fin: "30 abr 2026",  participantes: 280, presupuesto: "$1,1M" },
];

const card: React.CSSProperties = {
  background: "#0E0B28",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "0.875rem",
};

export default function Campanas() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Campañas</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>Gestión de promociones del casino</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#6B32D6,#1A5ED8)", boxShadow: "0 4px 16px rgba(107,50,214,0.3)" }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          Nueva campaña
        </button>
      </div>

      <div className="space-y-3">
        {CAMPANAS.map((c) => {
          const isOpen = selected === c.id;
          return (
            <div
              key={c.id}
              className="rounded-2xl p-5 cursor-pointer transition-all duration-200"
              style={{
                background: isOpen ? "rgba(107,50,214,0.07)" : "#0E0B28",
                border: isOpen ? "1px solid rgba(107,50,214,0.3)" : "1px solid rgba(255,255,255,0.06)",
              }}
              onClick={() => setSelected(isOpen ? null : c.id)}
            >
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(107,50,214,0.12)" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: "#8B5CE8" }}>
                      <path d="M9 1.5l2.2 6.6H18l-5.5 4 2.2 6.4L9 14.8l-5.7 3.7 2.2-6.4L0 8.1h6.8L9 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "rgba(237,232,252,0.9)" }}>{c.nombre}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(237,232,252,0.38)" }}>
                      {c.tipo} · {c.inicio} → {c.fin}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-medium px-3 py-1 rounded-full"
                    style={c.estado === "Activa"
                      ? { background: "rgba(16,185,129,0.1)", color: "#34D399",  border: "1px solid rgba(16,185,129,0.18)" }
                      : { background: "rgba(100,116,139,0.1)", color: "#94A3B8", border: "1px solid rgba(100,116,139,0.15)" }
                    }
                  >
                    {c.estado}
                  </span>
                  <svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    style={{ color: "rgba(237,232,252,0.3)", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
                  >
                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {isOpen && (
                <div className="grid grid-cols-3 gap-3 mt-5 pt-5" style={{ borderTop: "1px solid rgba(107,50,214,0.15)" }}>
                  {[
                    { label: "Participantes", value: c.participantes },
                    { label: "Presupuesto",   value: c.presupuesto },
                    { label: "Tipo",          value: c.tipo },
                  ].map((item, i) => (
                    <div key={i} className="rounded-xl p-3 text-center" style={{ background: "rgba(107,50,214,0.06)", border: "1px solid rgba(107,50,214,0.12)" }}>
                      <p className="font-bold text-white text-lg">{item.value}</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(237,232,252,0.38)" }}>{item.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
