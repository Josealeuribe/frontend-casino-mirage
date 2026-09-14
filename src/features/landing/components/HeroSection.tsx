import { useState, useRef } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { pickPrize, type Prize } from "../data/prizes";
import PrizeRevealModal from "./PrizeRevealModal";

const MAX_SPINS = 3;

/* ─── Roulette wheel SVG ─── */
function RouletteWheel({ spinning }: { spinning: boolean }) {
  const reds = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
  const nums = [0, ...Array.from({ length: 36 }, (_, i) => i + 1)];

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: 320,
        height: 320,
        animation: spinning ? "float-none" : "float 3.5s ease-in-out infinite",
      }}
    >
      {/* Outer gold ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "linear-gradient(135deg, #D4A827 0%, #ECC84C 30%, #9A7010 60%, #D4A827 100%)",
          boxShadow: spinning
            ? "0 0 80px rgba(212,168,39,0.6), 0 0 140px rgba(107,50,214,0.25)"
            : "0 0 50px rgba(212,168,39,0.35), 0 0 100px rgba(107,50,214,0.15)",
          transition: "box-shadow 0.3s",
        }}
      />
      {/* Spinning disc */}
      <div
        className="absolute rounded-full overflow-hidden"
        style={{
          width: 296,
          height: 296,
          top: 12,
          left: 12,
          animation: spinning
            ? "spin-slow 0.4s linear infinite"
            : "spin-slow 22s linear infinite",
          transition: "animation-duration 0.3s",
        }}
      >
        <svg viewBox="0 0 296 296" width="296" height="296">
          {nums.map((num, i) => {
            const total = nums.length;
            const angle = (360 / total) * i;
            const nextAngle = (360 / total) * (i + 1);
            const a1 = (angle * Math.PI) / 180;
            const a2 = (nextAngle * Math.PI) / 180;
            const cx = 148, cy = 148, r = 144;
            const x1 = cx + r * Math.sin(a1), y1 = cy - r * Math.cos(a1);
            const x2 = cx + r * Math.sin(a2), y2 = cy - r * Math.cos(a2);
            const fill = num === 0 ? "#16a34a" : reds.has(num) ? "#991b1b" : "#0E0B28";
            const midAngle = (((angle + nextAngle) / 2) * Math.PI) / 180;
            const tr = 110;
            const tx = cx + tr * Math.sin(midAngle);
            const ty = cy - tr * Math.cos(midAngle);
            return (
              <g key={i}>
                <path
                  d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
                  fill={fill}
                  stroke="rgba(212,168,39,0.2)"
                  strokeWidth="0.5"
                />
                <text
                  x={tx} y={ty}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="6.5" fontWeight="700" fill="white"
                  transform={`rotate(${angle + 360 / total / 2}, ${tx}, ${ty})`}
                  opacity="0.9"
                >
                  {num}
                </text>
              </g>
            );
          })}
          <circle cx="148" cy="148" r="38" fill="#0E0B28" stroke="rgba(212,168,39,0.4)" strokeWidth="1.5" />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <line
              key={deg}
              x1={148 + 10 * Math.sin((deg * Math.PI) / 180)}
              y1={148 - 10 * Math.cos((deg * Math.PI) / 180)}
              x2={148 + 36 * Math.sin((deg * Math.PI) / 180)}
              y2={148 - 36 * Math.cos((deg * Math.PI) / 180)}
              stroke="rgba(212,168,39,0.4)"
              strokeWidth="1"
            />
          ))}
          <circle cx="148" cy="148" r="10" fill="#D4A827" />
          <circle cx="148" cy="148" r="5" fill="#0E0B28" />
        </svg>
      </div>

      {/* Ball */}
      <div
        className="absolute rounded-full bg-white z-10 shadow-lg"
        style={{
          width: 10, height: 10,
          top: 16, left: "50%",
          transform: "translateX(-50%)",
          boxShadow: "0 0 6px rgba(255,255,255,0.8)",
        }}
      />
    </div>
  );
}

/* ─── Spin counter dots ─── */
function SpinDots({ used, max }: { used: number; max: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: 8, height: 8,
            background: i < used ? "rgba(237,232,252,0.2)" : "linear-gradient(135deg,#6B32D6,#00C4D8)",
            boxShadow: i < used ? "none" : "0 0 8px rgba(107,50,214,0.5)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main component ─── */
export default function HeroSection() {
  const { openLogin, user } = useAuth();
  const [spinning, setSpinning] = useState(false);
  const [spinsUsed, setSpinsUsed] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [showResult, setShowResult] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const daysLeft = Math.max(0, Math.ceil((new Date("2026-09-30").getTime() - Date.now()) / 86400000));
  const spinsLeft = MAX_SPINS - spinsUsed;
  const allSpinsUsed = spinsLeft <= 0;

  const handleSpin = () => {
    if (spinning || allSpinsUsed) return;
    setSpinning(true);
    timerRef.current = setTimeout(() => {
      const prize = pickPrize();
      setWonPrize(prize);
      setSpinsUsed((n) => n + 1);
      setSpinning(false);
      setShowResult(true);
    }, 3000);
  };

  const handleIgnore = () => {
    setShowResult(false);
    setWonPrize(null);
  };

  const handleRegister = () => {
    setShowResult(false);
    openLogin();
  };

  return (
    <>
      <section
        id="inicio"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16"
        style={{ background: "#080718" }}
      >
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 30% 20%, rgba(107,50,214,0.18) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 75% 70%, rgba(0,196,216,0.1) 0%, transparent 70%)",
            }}
          />
          <img
            src="https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=1800&h=900&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover opacity-[0.07]"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(8,7,24,0.5) 0%, rgba(8,7,24,0.75) 60%, #080718 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl animate-fade-in-up">
          <span
            className="text-xs font-medium tracking-[0.22em] uppercase mb-5 px-4 py-1.5 rounded-full"
            style={{
              color: "#00C4D8",
              background: "rgba(0,196,216,0.1)",
              border: "1px solid rgba(0,196,216,0.22)",
            }}
          >
            Promoción de Bienvenida
          </span>

          <h1
            className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight"
            style={{ letterSpacing: "-0.01em" }}
          >
            ¡Es tu momento
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #D4A827 0%, #ECC84C 40%, #00C4D8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              de ganar!
            </span>
          </h1>

          <p className="text-base mb-8 max-w-lg leading-relaxed" style={{ color: "rgba(237,232,252,0.55)" }}>
            Presiona el botón, gira la ruleta y descubre tu bono. Redimible únicamente en nuestros casinos físicos de Arauca.
          </p>

          {/* Spin button / state */}
          <div className="flex flex-col items-center gap-4 mb-6">
            {allSpinsUsed ? (
              <div
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(237,232,252,0.4)",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M7.5 4.5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                Usaste tus {MAX_SPINS} intentos
              </div>
            ) : !user ? (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleSpin}
                  disabled={spinning}
                  className="flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm text-white transition-all duration-200"
                  style={{
                    background: spinning
                      ? "rgba(107,50,214,0.5)"
                      : "linear-gradient(135deg, #6B32D6 0%, #1A5ED8 100%)",
                    boxShadow: spinning ? "none" : "0 6px 28px rgba(107,50,214,0.4)",
                    letterSpacing: "0.03em",
                    cursor: spinning ? "not-allowed" : "pointer",
                  }}
                >
                  {spinning ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin-slow" style={{ animationDuration: "1s" }}>
                        <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5" strokeDasharray="20 18" />
                      </svg>
                      Girando...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" stroke="white" strokeWidth="1.4" />
                        <path d="M5 8a3 3 0 016 0" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                        <path d="M11 6l0 2-2 0" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Girar la Ruleta
                    </>
                  )}
                </button>
                <button
                  onClick={openLogin}
                  className="text-sm transition-all"
                  style={{ color: "rgba(237,232,252,0.35)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.65)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.35)"; }}
                >
                  ¿Ya tienes cuenta? Inicia sesión
                </button>
              </div>
            ) : (
              <button
                onClick={handleSpin}
                disabled={spinning}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm text-white transition-all duration-200"
                style={{
                  background: spinning ? "rgba(107,50,214,0.5)" : "linear-gradient(135deg,#6B32D6,#1A5ED8)",
                  boxShadow: spinning ? "none" : "0 6px 28px rgba(107,50,214,0.4)",
                  cursor: spinning ? "not-allowed" : "pointer",
                }}
              >
                {spinning ? "Girando..." : "Girar la Ruleta"}
              </button>
            )}

            {/* Spin counter */}
            {!allSpinsUsed && (
              <div className="flex flex-col items-center gap-2">
                <SpinDots used={spinsUsed} max={MAX_SPINS} />
                <p className="text-xs" style={{ color: "rgba(237,232,252,0.3)" }}>
                  {spinsLeft} {spinsLeft === 1 ? "intento" : "intentos"} restante{spinsLeft !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>

          {/* Deadline badge */}
          <div
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-full flex-wrap justify-center"
            style={{
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.18)",
              color: "rgba(52,211,153,0.85)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="2.5" width="10" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
              <path d="M4 2.5V1M8 2.5V1M1 5.5h10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
            <span>Redime tu bono hasta el</span>
            <strong style={{ color: "#34D399" }}>30 de septiembre de 2026</strong>
            <span style={{ color: "rgba(237,232,252,0.2)" }}>·</span>
            <span>quedan {daysLeft} días</span>
          </div>
        </div>

        {/* Roulette */}
        <div className="relative z-10 mt-12 mb-8">
          <RouletteWheel spinning={spinning} />
        </div>
      </section>

      {/* Prize reveal modal */}
      {showResult && wonPrize && (
        <PrizeRevealModal
          prize={wonPrize}
          spinsLeft={spinsLeft}
          onRegister={handleRegister}
          onIgnore={handleIgnore}
        />
      )}
    </>
  );
}
