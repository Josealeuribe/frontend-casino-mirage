import { useState } from "react";
import { Download } from "lucide-react";
import { adminFetchCanjes, type AdminCanje } from "@/shared/api/client";
import { useAdminFetch } from "../useAdminFetch";
import { AdminCargando, AdminError } from "../AdminStates";
import { descargarExcel, type ColumnaExcel } from "../excelExport";

const card: React.CSSProperties = {
  background: "#0E0B28",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "0.875rem",
};

const COLUMNAS_CANJES: ColumnaExcel[] = [
  { header: "Código", key: "codigo", width: 20 },
  { header: "Cliente", key: "cliente", width: 24 },
  { header: "Documento", key: "documento", width: 16 },
  { header: "Premio", key: "premio", width: 16 },
  { header: "Valor", key: "valor", width: 14, currency: true },
  { header: "Cajero", key: "cajero", width: 18 },
  { header: "Sede", key: "sede", width: 22 },
  { header: "Fecha", key: "fecha", width: 14 },
  { header: "Hora", key: "hora", width: 12 },
];

async function exportarExcel(canjes: AdminCanje[]) {
  const filas = canjes.map((c) => {
    const fecha = c.canjeadoEn ? new Date(c.canjeadoEn) : null;
    return {
      codigo: c.codigo,
      cliente: `${c.cliente.nombres} ${c.cliente.apellidos}`,
      documento: c.cliente.docNumero,
      premio: c.premio.nombre,
      valor: c.premio.monto,
      cajero: c.canjeadoPor ?? "",
      sede: c.sede ?? "",
      fecha: fecha ? fecha.toLocaleDateString("es-CO") : "",
      hora: fecha ? fecha.toLocaleTimeString("es-CO") : "",
    };
  });
  await descargarExcel(`auditoria-canjes-${new Date().toISOString().slice(0, 10)}.xlsx`, "Auditoría de Canjes", COLUMNAS_CANJES, filas);
}

export default function AuditoriaCanjes() {
  const { data, loading, error } = useAdminFetch(adminFetchCanjes);
  const [exportando, setExportando] = useState(false);

  if (loading) return <AdminCargando />;
  if (error) return <AdminError message={error} />;
  if (!data) return null;

  const { kpis, canjes } = data;

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
          onClick={async () => {
            setExportando(true);
            try {
              await exportarExcel(canjes);
            } finally {
              setExportando(false);
            }
          }}
          disabled={canjes.length === 0 || exportando}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(237,232,252,0.6)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
        >
          <Download size={13} />
          {exportando ? "Generando..." : "Descargar Excel"}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3.5">
        {[
          { label: "Total canjeados", value: String(kpis.totalCanjeados), color: "#10B981" },
          { label: "Valor total", value: `$${kpis.valorTotal.toLocaleString("es-CO")}`, color: "#D4A827" },
          { label: "Tasa de canje", value: `${kpis.tasaCanje}%`, color: "#8B5CE8" },
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
              {["Código", "Cliente", "Documento", "Bono", "Cajero", "Sede", "Fecha", "Hora"].map((h) => (
                <th key={h} className="text-left text-xs font-medium px-4 py-3 uppercase tracking-wider whitespace-nowrap" style={{ color: "rgba(237,232,252,0.3)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {canjes.map((c) => {
              const fecha = c.canjeadoEn ? new Date(c.canjeadoEn) : null;
              return (
                <tr
                  key={c.codigo}
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                  className="transition-colors"
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(107,50,214,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "rgba(237,232,252,0.3)" }}>{c.codigo}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: "rgba(237,232,252,0.85)" }}>{c.cliente.nombres} {c.cliente.apellidos}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.4)" }}>{c.cliente.docNumero}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: "#D4A827" }}>${c.premio.monto.toLocaleString("es-CO")}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.5)" }}>{c.canjeadoPor ?? "—"}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.4)" }}>{c.sede ?? "—"}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "rgba(237,232,252,0.35)" }}>
                    {fecha ? fecha.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.35)" }}>
                    {fecha ? fecha.toLocaleTimeString("es-CO") : "—"}
                  </td>
                </tr>
              );
            })}
            {canjes.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm" style={{ color: "rgba(237,232,252,0.28)" }}>
                  Todavía no hay canjes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
