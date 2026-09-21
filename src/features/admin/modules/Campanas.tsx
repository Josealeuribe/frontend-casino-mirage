import { useState } from "react";
import { Trophy, ChevronDown } from "lucide-react";
import { adminFetchPremios } from "@/shared/api/client";
import { useAdminFetch } from "../useAdminFetch";
import { AdminCargando, AdminError } from "../AdminStates";

const card: React.CSSProperties = {
  background: "#0E0B28",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "0.875rem",
};

// timeZone fija a Colombia -- ver la misma nota en VistaGeneral.tsx.
function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Bogota" });
}

export default function Campanas() {
  const { data, loading, error } = useAdminFetch(adminFetchPremios);
  const [selected, setSelected] = useState<number | null>(null);

  if (loading) return <AdminCargando />;
  if (error) return <AdminError message={error} />;
  if (!data) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Campañas</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>Catálogo de premios de la promoción activa</p>
        </div>
      </div>

      <div className="space-y-3">
        {data.premios.map((p) => {
          const isOpen = selected === p.id;
          const activa = new Date(p.vigenciaHasta).getTime() >= Date.now();
          return (
            <div
              key={p.id}
              className="rounded-2xl p-5 cursor-pointer transition-all duration-200"
              style={{
                background: isOpen ? "rgba(107,50,214,0.07)" : "#0E0B28",
                border: isOpen ? "1px solid rgba(107,50,214,0.3)" : "1px solid rgba(255,255,255,0.06)",
              }}
              onClick={() => setSelected(isOpen ? null : p.id)}
            >
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(107,50,214,0.12)" }}
                  >
                    <Trophy size={18} style={{ color: "#8B5CE8" }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "rgba(237,232,252,0.9)" }}>{p.nombre}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(237,232,252,0.38)" }}>
                      {p.clave} · vigente hasta {formatFecha(p.vigenciaHasta)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-medium px-3 py-1 rounded-full"
                    style={activa
                      ? { background: "rgba(16,185,129,0.1)", color: "#34D399", border: "1px solid rgba(16,185,129,0.18)" }
                      : { background: "rgba(100,116,139,0.1)", color: "#94A3B8", border: "1px solid rgba(100,116,139,0.15)" }
                    }
                  >
                    {activa ? "Activa" : "Vencida"}
                  </span>
                  <ChevronDown
                    size={14}
                    style={{ color: "rgba(237,232,252,0.3)", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
                  />
                </div>
              </div>

              {isOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5" style={{ borderTop: "1px solid rgba(107,50,214,0.15)" }}>
                  {[
                    { label: "Bonos entregados", value: p.entregados },
                    { label: "Bonos canjeados", value: p.canjeados },
                    { label: "Monto", value: `$${p.monto.toLocaleString("es-CO")}` },
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
        {data.premios.length === 0 && (
          <div style={{ ...card, padding: "2rem" }}>
            <p className="text-sm text-center" style={{ color: "rgba(237,232,252,0.3)" }}>No hay premios configurados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
