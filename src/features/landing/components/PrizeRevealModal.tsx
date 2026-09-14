import type { Prize } from "../data/prizes";

interface Props {
  prize: Prize;
  spinsLeft: number;
  onRegister: () => void;
  onIgnore: () => void;
}

function PrizeIcon({ type }: { type: string }) {
  const s = { color: "#D4A827", width: 36, height: 36 };
  if (type === "coin")
    return (
      <svg {...s} viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="18" cy="18" r="9" stroke="currentColor" strokeWidth="1.8" />
        <text x="18" y="22" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">$</text>
      </svg>
    );
  if (type === "card")
    return (
      <svg {...s} viewBox="0 0 36 36" fill="none">
        <rect x="4" y="9" width="28" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 15h28" stroke="currentColor" strokeWidth="1.8" />
        <rect x="8" y="20" width="8" height="3" rx="1" fill="currentColor" opacity="0.5" />
      </svg>
    );
  if (type === "gift")
    return (
      <svg {...s} viewBox="0 0 36 36" fill="none">
        <rect x="5" y="16" width="26" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <rect x="5" y="10" width="26" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M18 10v22" stroke="currentColor" strokeWidth="1.8" />
        <path d="M18 10c0 0-3-5-6-3s-1 6 6 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M18 10c0 0 3-5 6-3s1 6-6 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  if (type === "layers")
    return (
      <svg {...s} viewBox="0 0 36 36" fill="none">
        <path d="M18 4L32 12 18 20 4 12 18 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M4 20l14 8 14-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4 26l14 8 14-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  if (type === "ticket")
    return (
      <svg {...s} viewBox="0 0 36 36" fill="none">
        <path d="M4 13a4 4 0 000 10h28a4 4 0 000-10H4z" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="13" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 15h8M20 18h6M20 21h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  if (type === "trophy")
    return (
      <svg {...s} viewBox="0 0 36 36" fill="none">
        <path d="M12 6h12v12a6 6 0 01-12 0V6z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 10H7a4 4 0 004 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M24 10h5a4 4 0 01-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M18 24v4M14 28h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  // party
  return (
    <svg {...s} viewBox="0 0 36 36" fill="none">
      <path d="M6 30L16 10l10 14-6 1 3 5H6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="28" cy="8" r="2" fill="currentColor" opacity="0.6" />
      <path d="M24 4l1 3M29 3l-1 3M32 7l-3 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
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
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.1" />
                <path d="M5.5 3v2.5l1.5 1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
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
