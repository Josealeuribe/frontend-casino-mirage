import { useEffect, useState } from "react";
import { ApiError, cajeroFetchHistorial, type CajeroHistorialItem } from "@/shared/api/client";

const card: React.CSSProperties = {
  background: "#0E0B28",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "0.875rem",
};

function formatMonto(monto: number) {
  return `$${monto.toLocaleString("es-CO")}`;
}

function formatFecha(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("es-CO");
  } catch {
    return iso;
  }
}

export default function Historial() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [soloPropios, setSoloPropios] = useState(true);
  const [canjes, setCanjes] = useState<CajeroHistorialItem[]>([]);

  useEffect(() => {
    let cancelado = false;
    setLoading(true);
    setError("");
    cajeroFetchHistorial()
      .then((res) => {
        if (cancelado) return;
        setSoloPropios(res.soloPropios);
        setCanjes(res.canjes);
      })
      .catch((err) => {
        if (cancelado) return;
        const message = err instanceof ApiError ? err.message : "No se pudo cargar el historial.";
        setError(message);
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });
    return () => { cancelado = true; };
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">{soloPropios ? "Mis canjes" : "Todos los canjes"}</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>
          {soloPropios
            ? "Los canjes que has confirmado en tu sesión de cajero."
            : "Todos los canjes confirmados por el equipo."}
        </p>
      </div>

      {error && (
        <p
          className="text-sm rounded-lg px-4 py-3"
          style={{ background: "rgba(239,68,68,0.08)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.18)" }}
        >
          {error}
        </p>
      )}

      {loading ? (
        <div className="rounded-xl p-8 text-center text-sm" style={{ ...card, color: "rgba(237,232,252,0.4)" }}>
          Cargando historial...
        </div>
      ) : canjes.length === 0 ? (
        <div className="rounded-xl p-8 text-center text-sm" style={{ ...card, color: "rgba(237,232,252,0.4)" }}>
          Todavía no hay canjes registrados.
        </div>
      ) : (
        <div style={{ ...card, overflow: "hidden" }}>
          <table className="w-full text-sm">
            <thead style={{ background: "#0C0924" }}>
              <tr>
                {["Código", "Cliente", "Documento", "Premio", "Sede", "Fecha", "Cajero"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-medium px-4 py-3 uppercase tracking-wider whitespace-nowrap"
                    style={{ color: "rgba(237,232,252,0.3)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {canjes.map((c) => (
                <tr
                  key={c.codigo}
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                  className="transition-colors"
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(107,50,214,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "rgba(237,232,252,0.3)" }}>{c.codigo}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: "rgba(237,232,252,0.85)" }}>
                    {c.cliente.nombres} {c.cliente.apellidos}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.4)" }}>{c.cliente.docNumero}</td>
                  <td className="px-4 py-3" style={{ color: "rgba(237,232,252,0.75)" }}>
                    {c.premio.nombre}{" "}
                    <span className="font-semibold" style={{ color: "#D4A827" }}>({formatMonto(c.premio.monto)})</span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.4)" }}>{c.sede ?? "—"}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "rgba(237,232,252,0.35)" }}>
                    {formatFecha(c.canjeadoEn)}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.5)" }}>{c.canjeadoPor ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
