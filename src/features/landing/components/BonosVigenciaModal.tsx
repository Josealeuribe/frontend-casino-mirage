import { useEffect, useState } from "react";
import { Coins, Gift, Trophy, X, CalendarClock } from "lucide-react";
import { fetchPremiosVigencia, type PremioVigencia } from "@/shared/api/client";
import { ICONO_POR_CLAVE } from "../data/prizes";

interface Props {
  onClose: () => void;
}

function PrizeIcon({ type }: { type: string }) {
  const props = { size: 24, strokeWidth: 1.7 };
  if (type === "coin") return <Coins {...props} />;
  if (type === "gift") return <Gift {...props} />;
  return <Trophy {...props} />;
}

/** Modal informativo, disparado desde un botón justo debajo de la ruleta:
 *  a diferencia del aviso corto de vigencia que ya vive arriba de la rueda
 *  (una sola fecha, la más próxima), aquí se listan los 3 bonos completos
 *  con SU PROPIA fecha límite -- un admin puede extender la de uno solo sin
 *  tocar los otros dos, así que no alcanza con mostrar una fecha genérica. */
export default function BonosVigenciaModal({ onClose }: Props) {
  const [premios, setPremios] = useState<PremioVigencia[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchPremiosVigencia()
      .then((r) => setPremios(r.premios))
      .catch(() => setError(true));
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(4,3,16,0.9)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #130E2E 0%, #0E0B28 100%)",
          border: "1px solid rgba(212,168,39,0.3)",
          boxShadow: "0 40px 100px rgba(4,3,16,0.8), 0 0 80px rgba(212,168,39,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 p-1.5 rounded-full transition-colors"
          style={{ color: "rgba(237,232,252,0.5)", background: "rgba(255,255,255,0.04)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#EDE8FC"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.5)"; }}
        >
          <X size={16} strokeWidth={2} />
        </button>

        {/* Header */}
        <div
          className="py-5 px-6 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(212,168,39,0.12) 0%, rgba(107,50,214,0.12) 100%)",
            borderBottom: "1px solid rgba(212,168,39,0.15)",
          }}
        >
          <p className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: "rgba(212,168,39,0.7)" }}>
            Bonos de la promoción
          </p>
          <p className="text-sm mt-0.5" style={{ color: "rgba(237,232,252,0.45)" }}>
            Estos son los 3 bonos y hasta cuándo puedes redimir cada uno
          </p>
        </div>

        {/* Lista de bonos */}
        <div className="px-5 py-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {error && (
            <p className="text-sm text-center py-6" style={{ color: "rgba(237,232,252,0.45)" }}>
              No se pudieron cargar los bonos. Intenta de nuevo más tarde.
            </p>
          )}

          {!error && !premios && (
            <p className="text-sm text-center py-6" style={{ color: "rgba(237,232,252,0.35)" }}>
              Cargando bonos...
            </p>
          )}

          {premios?.map((premio) => {
            const vigencia = new Date(premio.vigenciaHasta);
            const daysLeft = Math.max(0, Math.ceil((vigencia.getTime() - Date.now()) / 86400000));
            // timeZone fija a Colombia -- ver la misma nota en RuletaPage.
            const vigenciaLabel = vigencia.toLocaleDateString("es-CO", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              timeZone: "America/Bogota",
            });

            return (
              <div
                key={premio.clave}
                className="rounded-2xl p-4 flex items-start gap-3.5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(212,168,39,0.1)", color: "#D4A827" }}
                >
                  <PrizeIcon type={ICONO_POR_CLAVE[premio.clave] ?? "coin"} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white text-sm">{premio.nombre}</p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "rgba(237,232,252,0.45)" }}>
                    {premio.detalle}
                  </p>
                  <div
                    className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full flex-wrap"
                    style={{
                      background: "rgba(16,185,129,0.08)",
                      border: "1px solid rgba(16,185,129,0.18)",
                      color: "rgba(52,211,153,0.85)",
                    }}
                  >
                    <CalendarClock size={11} strokeWidth={1.6} />
                    <span>Vigente hasta el</span>
                    <strong style={{ color: "#34D399" }}>{vigenciaLabel}</strong>
                    <span style={{ color: "rgba(237,232,252,0.2)" }}>·</span>
                    <span>{daysLeft} {daysLeft === 1 ? "día" : "días"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: "rgba(107,50,214,0.12)", border: "1px solid rgba(107,50,214,0.22)", color: "#C4B5FD" }}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
