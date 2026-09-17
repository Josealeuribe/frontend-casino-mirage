import { useEffect, useState } from "react";
import { ApiError, cajeroFetchVigencias, type VigenciaPremio } from "@/shared/api/client";
import { ErrorPill, formatMonto } from "./ResultadoCanje";

const card: React.CSSProperties = {
  background: "#0E0B28",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "0.875rem",
};

function formatFechaCorta(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function diasRestantes(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86400000));
}

// Vista de solo lectura: a diferencia del módulo de Vigencias del panel
// admin (que sí permite editar fechas), /cajero/vigencias es un endpoint
// deliberadamente más restringido -- el cajero solo necesita consultar,
// nunca modificar.
export default function Vigencias() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [premios, setPremios] = useState<VigenciaPremio[]>([]);

  useEffect(() => {
    let cancelado = false;
    setLoading(true);
    setError("");
    cajeroFetchVigencias()
      .then((res) => {
        if (cancelado) return;
        setPremios(res.premios);
      })
      .catch((err) => {
        if (cancelado) return;
        const message = err instanceof ApiError ? err.message : "No se pudieron cargar las vigencias.";
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
        <h1 className="text-2xl font-bold text-white">Vigencias de premios</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>
          Fecha límite para canjear cada premio, del más próximo a vencer al más lejano.
        </p>
      </div>

      {error && <ErrorPill message={error} />}

      {loading ? (
        <div className="rounded-xl p-8 text-center text-sm" style={{ ...card, color: "rgba(237,232,252,0.4)" }}>
          Cargando vigencias...
        </div>
      ) : premios.length === 0 ? (
        <div className="rounded-xl p-8 text-center text-sm" style={{ ...card, color: "rgba(237,232,252,0.4)" }}>
          No hay premios con vigencia configurada.
        </div>
      ) : (
        <div className="space-y-3">
          {premios.map((p) => {
            const dias = diasRestantes(p.vigenciaHasta);
            const proximo = dias <= 7;
            return (
              <div key={p.clave} className="rounded-xl p-5 flex flex-wrap items-center justify-between gap-3" style={card}>
                <div>
                  <p className="font-bold text-white">{p.nombre}</p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: "#D4A827" }}>{formatMonto(p.monto)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: proximo ? "#FCA5A5" : "#34D399" }}>
                    Hasta el {formatFechaCorta(p.vigenciaHasta)}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(237,232,252,0.4)" }}>
                    Quedan {dias} {dias === 1 ? "día" : "días"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
