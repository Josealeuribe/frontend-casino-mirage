import { PRIZES } from "../data/prizes";

function PrizeIcon({ type, size = 28 }: { type: string; size?: number }) {
  const props = { width: size, height: size, viewBox: "0 0 28 28", fill: "none" as const };
  if (type === "coin")
    return <svg {...props}><circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.6"/><circle cx="14" cy="14" r="6" stroke="currentColor" strokeWidth="1.6"/><text x="14" y="18" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor">$</text></svg>;
  if (type === "card")
    return <svg {...props}><rect x="3" y="7" width="22" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="M3 12h22" stroke="currentColor" strokeWidth="1.6"/><rect x="6" y="16" width="7" height="2" rx="1" fill="currentColor" opacity="0.5"/></svg>;
  if (type === "gift")
    return <svg {...props}><rect x="4" y="12" width="20" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="4" y="8" width="20" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><path d="M14 8v16" stroke="currentColor" strokeWidth="1.6"/><path d="M14 8c0 0-2.5-4-5-2.5s-1 5 5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M14 8c0 0 2.5-4 5-2.5s1 5-5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>;
  if (type === "layers")
    return <svg {...props}><path d="M14 3L25 9 14 15 3 9 14 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M3 15l11 6 11-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M3 21l11 6 11-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
  if (type === "ticket")
    return <svg {...props}><path d="M3 10a3 3 0 000 8h22a3 3 0 000-8H3z" stroke="currentColor" strokeWidth="1.6"/><circle cx="10" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M15.5 11.5h7M15.5 14h5M15.5 16.5h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
  if (type === "trophy")
    return <svg {...props}><path d="M9 4h10v10a5 5 0 01-10 0V4z" stroke="currentColor" strokeWidth="1.6"/><path d="M9 8H5a3 3 0 003 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M19 8h4a3 3 0 01-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M14 19v4M10 23h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
  return <svg {...props}><path d="M5 24L13 8l8 11-5 1 3 4H5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><circle cx="22" cy="6" r="1.5" fill="currentColor" opacity="0.5"/><path d="M18 3l1 3M23 2l-1 3M26 5l-3 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}

export default function PrizesSection() {
  return (
    <section id="premios" className="py-28 px-4" style={{ background: "#080718" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span
            className="text-xs font-medium tracking-[0.22em] uppercase mb-4 inline-block px-4 py-1.5 rounded-full"
            style={{ color: "#D4A827", background: "rgba(212,168,39,0.1)", border: "1px solid rgba(212,168,39,0.22)" }}
          >
            Premios
          </span>
          <h2
            className="text-4xl md:text-5xl font-black text-white mt-5 mb-4"
            style={{ letterSpacing: "-0.01em" }}
          >
            ¿Qué puedes ganar?
          </h2>
          <p className="max-w-md mx-auto text-base" style={{ color: "rgba(237,232,252,0.5)" }}>
            La ruleta puede detenerse en cualquiera de estos premios. ¡Cada giro es una oportunidad!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRIZES.map((prize) => (
            <div
              key={prize.id}
              className="relative rounded-2xl p-6 transition-all duration-300 group"
              style={{
                background: "rgba(14,11,40,0.85)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(212,168,39,0.3)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(212,168,39,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Badge */}
              <span
                className="absolute top-4 right-4 text-xs font-semibold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
                style={{ background: "rgba(212,168,39,0.1)", color: "#D4A827", border: "1px solid rgba(212,168,39,0.2)" }}
              >
                {prize.badge}
              </span>

              {/* Icon */}
              <div
                className="mb-4 p-2 inline-flex rounded-xl"
                style={{ background: "rgba(212,168,39,0.08)", color: "#D4A827" }}
              >
                <PrizeIcon type={prize.icon} size={28} />
              </div>

              <h3 className="font-bold text-white text-lg mb-2" style={{ letterSpacing: "-0.01em" }}>
                {prize.name}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(237,232,252,0.45)" }}>
                {prize.desc}
              </p>
            </div>
          ))}
        </div>

        <div
          className="mt-8 rounded-2xl p-6 text-center"
          style={{ background: "rgba(14,11,40,0.6)", border: "1px solid rgba(107,50,214,0.15)" }}
        >
          <p className="text-sm" style={{ color: "rgba(237,232,252,0.5)" }}>
            Todos los premios son canjeables en cualquiera de nuestras sedes
          </p>
          <p className="text-xs mt-2" style={{ color: "rgba(237,232,252,0.28)" }}>
            Mirage Casino Ventura Plaza · Av. 5 · Av. 0 — Cúcuta
          </p>
        </div>
      </div>
    </section>
  );
}
