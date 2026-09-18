import { Coins, Gift, Trophy, Clock, AlertTriangle } from "lucide-react";
import type { Prize } from "../data/prizes";
import { useCuentaRegresiva } from "@/shared/hooks/useCuentaRegresiva";

interface Props {
  prize: Prize;
  spinsLeft: number;
  /** Instante (epoch ms) en que vence el ticket de este premio -- viene del
   *  `exp` real del JWT que emitio el servidor (30 minutos, ver
   *  TICKET_TTL_MINUTES en el backend). `null` si por algun motivo no se
   *  pudo leer: en ese caso no se muestra cuenta regresiva, solo el aviso. */
  expiraEnMs: number | null;
  onRegister: () => void;
  onIgnore: () => void;
}

function PrizeIcon({ type }: { type: string }) {
  const s = { color: "#D4A827", size: 36, strokeWidth: 1.8 };
  if (type === "coin") return <Coins {...s} />;
  if (type === "gift") return <Gift {...s} />;
  // trophy
  return <Trophy {...s} />;
}

export default function PrizeRevealModal({ prize, spinsLeft, expiraEnMs, onRegister, onIgnore }: Props) {
  const { etiqueta, expirado } = useCuentaRegresiva(expiraEnMs);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(4,3,16,0.9)", backdropFilter: "blur(12px)" }}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #130E2E 0%, #0E0B28 100%)",
          border: "1px solid rgba(212,168,39,0.3)",
          boxShadow: "0 40px 100px rgba(4,3,16,0.8), 0 0 80px rgba(212,168,39,0.08)",
        }}
      >
        {/* Gold shimmer header */}
        <div
          className="py-5 px-6 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(212,168,39,0.12) 0%, rgba(107,50,214,0.12) 100%)",
            borderBottom: "1px solid rgba(212,168,39,0.15)",
          }}
        >
          <p className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: "rgba(212,168,39,0.7)" }}>
            ¡Felicidades!
          </p>
          <p className="text-sm mt-0.5" style={{ color: "rgba(237,232,252,0.45)" }}>
            Giraste la ruleta y ganaste:
          </p>
        </div>

        {/* Prize */}
        <div className="px-8 py-8 text-center">
          {/* Icon */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{
              background: "radial-gradient(circle, rgba(212,168,39,0.15) 0%, rgba(212,168,39,0.04) 100%)",
              border: "1px solid rgba(212,168,39,0.25)",
            }}
          >
            <PrizeIcon type={prize.icon} />
          </div>

          {/* Badge */}
          <span
            className="text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full inline-block mb-4"
            style={{ background: "rgba(212,168,39,0.12)", color: "#D4A827", border: "1px solid rgba(212,168,39,0.25)" }}
          >
            {prize.badge}
          </span>

          <h2
            className="text-2xl font-black text-white mb-3"
            style={{ letterSpacing: "-0.01em" }}
          >
            {prize.name}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(237,232,252,0.5)" }}>
            {prize.desc}
          </p>

          {/* Ventana de 30 minutos para registrarse: el ticket firmado que
              respalda este premio vence a los 30 minutos exactos (lo decide
              el servidor, no el navegador). Si sale de la app y no vuelve a
              tiempo, o gira otra vez antes de registrarse, este premio se
              pierde -- solo el ultimo giro registrado dentro de esos 30
              minutos cuenta. */}
          <div
            className="mt-5 rounded-2xl px-4 py-3 text-left"
            style={{
              background: expirado ? "rgba(239,68,68,0.08)" : "rgba(212,168,39,0.08)",
              border: `1px solid ${expirado ? "rgba(239,68,68,0.25)" : "rgba(212,168,39,0.22)"}`,
            }}
          >
            <div className="flex items-center gap-2">
              {expirado ? (
                <AlertTriangle size={14} strokeWidth={1.8} style={{ color: "#FCA5A5", flexShrink: 0 }} />
              ) : (
                <Clock size={14} strokeWidth={1.8} style={{ color: "#D4A827", flexShrink: 0 }} />
              )}
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: expirado ? "#FCA5A5" : "#D4A827" }}>
                {expirado ? "Tiempo agotado" : `Tienes 30 minutos${etiqueta ? ` · quedan ${etiqueta}` : ""}`}
              </span>
            </div>
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "rgba(237,232,252,0.5)" }}>
              {expirado
                ? "El tiempo para reclamar este premio ya se venció. Puedes registrarte igual, pero el bono ya no se asignará."
                : "Regístrate ahora para reservarlo. Si sales de la aplicación o dejas pasar el tiempo, perderás la oportunidad."}
            </p>
          </div>

          {/* Spins remaining */}
          {spinsLeft > 0 && (
            <div
              className="mt-5 flex items-center justify-center gap-2 text-xs px-4 py-2 rounded-full mx-auto w-fit"
              style={{ background: "rgba(107,50,214,0.1)", border: "1px solid rgba(107,50,214,0.2)", color: "rgba(237,232,252,0.5)" }}
            >
              <Clock size={11} strokeWidth={1.6} />
              Te {spinsLeft === 1 ? "queda" : "quedan"} <strong style={{ color: "#C4B5FD" }}>{spinsLeft} {spinsLeft === 1 ? "intento" : "intentos"}</strong> más
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 space-y-3">
          <button
            onClick={onRegister}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #6B32D6 0%, #1A5ED8 100%)",
              boxShadow: "0 6px 24px rgba(107,50,214,0.35)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(107,50,214,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(107,50,214,0.35)"; }}
          >
            Registrarme y Reclamar Premio
          </button>
          <button
            onClick={onIgnore}
            className="w-full py-2.5 rounded-xl text-sm transition-all duration-200"
            style={{ color: "rgba(237,232,252,0.35)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.6)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.35)"; }}
          >
            Ignorar por ahora
          </button>
        </div>
      </div>
    </div>
  );
}
