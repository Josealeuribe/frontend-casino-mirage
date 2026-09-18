import { useEffect, useState } from "react";
import {
  ApiError,
  adminActualizarVigencia,
  adminFetchPremios,
  adminFetchVigenciaHistorial,
  type AdminPremio,
  type CambioVigencia,
} from "@/shared/api/client";
import { useAdminFetch } from "../useAdminFetch";
import { AdminCargando, AdminError } from "../AdminStates";

const card: React.CSSProperties = {
  background: "#0E0B28",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "0.875rem",
};

// timeZone fija a Colombia -- ver la misma nota en admin/modules/VistaGeneral.tsx.
function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Bogota" });
}

function ExtenderVigenciaForm({
  premio,
  onCancel,
  onDone,
}: {
  premio: AdminPremio;
  onCancel: () => void;
  onDone: () => void;
}) {
  const [nueva, setNueva] = useState("");
  const [motivo, setMotivo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async () => {
    if (!nueva || !motivo.trim()) {
      setFormError("La nueva fecha y el motivo son obligatorios.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await adminActualizarVigencia(premio.id, { nueva, motivo: motivo.trim() });
      onDone();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "No se pudo actualizar la vigencia.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 pt-4 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.38)" }}>
            Nueva fecha de vigencia
          </label>
          <input
            type="date"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            className="w-full rounded-xl px-3 py-2 text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(237,232,252,0.8)" }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.38)" }}>
            Motivo
          </label>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej: extensión por baja participación"
            className="w-full rounded-xl px-3 py-2 text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(237,232,252,0.8)" }}
          />
        </div>
      </div>
      {formError && <AdminError message={formError} />}
      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={submitting}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#6B32D6,#1A5ED8)" }}
        >
          {submitting ? "Guardando..." : "Confirmar cambio"}
        </button>
        <button
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 rounded-xl text-xs font-medium"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(237,232,252,0.6)" }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

function HistorialSection({ premioId }: { premioId: number }) {
  const [historial, setHistorial] = useState<CambioVigencia[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminFetchVigenciaHistorial(premioId)
      .then((res) => setHistorial(res.historial))
      .catch((err) => setError(err instanceof ApiError ? err.message : "No se pudo cargar el historial."))
      .finally(() => setLoading(false));
  }, [premioId]);

  if (loading) return <p className="text-xs py-3" style={{ color: "rgba(237,232,252,0.35)" }}>Cargando historial...</p>;
  if (error) return <AdminError message={error} />;
  if (!historial || historial.length === 0) {
    return <p className="text-xs py-3" style={{ color: "rgba(237,232,252,0.3)" }}>Sin cambios de vigencia registrados.</p>;
  }

  return (
    <div className="space-y-0 mt-2">
      {historial.map((h, i) => (
        <div key={h.id} className="py-2.5" style={{ borderBottom: i < historial.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
          <p className="text-xs" style={{ color: "rgba(237,232,252,0.7)" }}>
            {formatFecha(h.anterior)} → <strong style={{ color: "#C4B5FD" }}>{formatFecha(h.nueva)}</strong>
          </p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(237,232,252,0.4)" }}>{h.motivo}</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(237,232,252,0.25)" }}>
            {h.registradoPor} · {formatFecha(h.creadoEn)} · {h.bonosAfectados} bono(s) afectados
          </p>
        </div>
      ))}
    </div>
  );
}

export default function Vigencias() {
  const { data, loading, error, setData } = useAdminFetch(adminFetchPremios);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (loading) return <AdminCargando />;
  if (error) return <AdminError message={error} />;
  if (!data) return null;

  const reload = async () => {
    const result = await adminFetchPremios();
    setData(result);
    setEditingId(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Vigencias</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>Control de fechas de vigencia por premio</p>
      </div>

      <div className="space-y-4">
        {data.premios.map((premio) => {
          const now = new Date();
          const vigenciaHasta = new Date(premio.vigenciaHasta);
          const daysLeft = Math.max(0, Math.ceil((vigenciaHasta.getTime() - now.getTime()) / 86400000));
          const vencido = vigenciaHasta.getTime() < now.getTime();
          const isEditing = editingId === premio.id;
          const isExpanded = expandedId === premio.id;

          return (
            <div key={premio.id} style={{ ...card, padding: "1.5rem", border: "1px solid rgba(107,50,214,0.25)" }}>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <span
                    className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
                    style={
                      vencido
                        ? { background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.18)" }
                        : { background: "rgba(16,185,129,0.1)", color: "#34D399", border: "1px solid rgba(16,185,129,0.18)" }
                    }
                  >
                    {vencido ? "Vencido" : "Activo"}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-3">{premio.nombre}</h2>
                  <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>
                    Clave: {premio.clave} · ${premio.monto.toLocaleString("es-CO")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-black" style={{ color: daysLeft <= 7 ? "#F87171" : "#D4A827", lineHeight: 1 }}>
                    {daysLeft}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "rgba(237,232,252,0.35)" }}>días restantes</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { label: "Vigente hasta", value: formatFecha(premio.vigenciaHasta) },
                  { label: "Entregados", value: String(premio.entregados) },
                  { label: "Canjeados", value: String(premio.canjeados) },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <p className="text-xs mb-1" style={{ color: "rgba(237,232,252,0.3)" }}>{item.label}</p>
                    <p className="text-sm font-medium" style={{ color: "rgba(237,232,252,0.8)" }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => setEditingId(isEditing ? null : premio.id)}
                  className="text-xs px-4 py-2 rounded-xl transition-colors"
                  style={{ background: "rgba(107,50,214,0.1)", border: "1px solid rgba(107,50,214,0.2)", color: "#C4B5FD" }}
                >
                  {isEditing ? "Cerrar" : "Extender vigencia"}
                </button>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : premio.id)}
                  className="text-xs px-4 py-2 rounded-xl transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(237,232,252,0.6)" }}
                >
                  {isExpanded ? "Ocultar historial" : "Ver historial de cambios"}
                </button>
              </div>

              {isEditing && (
                <ExtenderVigenciaForm premio={premio} onCancel={() => setEditingId(null)} onDone={reload} />
              )}

              {isExpanded && (
                <div className="mt-4 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <h3 className="font-bold text-white text-sm mb-1">Historial de cambios</h3>
                  <HistorialSection premioId={premio.id} />
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
