import { Coins, Gift, Trophy, Clock } from "lucide-react";
import type { Prize } from "../data/prizes";

interface Props {
  prize: Prize;
  spinsLeft: number;
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

export default function PrizeRevealModal({ prize, spinsLeft, onRegister, onIgnore }: Props) {
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
