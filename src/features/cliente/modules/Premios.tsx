import { Coins, Gift, Trophy } from "lucide-react";
import { PRIZES } from "@/features/landing/data/prizes";

/** Copia reducida del ícono de `PrizesSection.tsx` (landing) -- no se
 *  reexportaba desde allá, así que se repite aquí en vez de tocar ese
 *  archivo público solo para exportar un componente interno. Mismo mapeo de
 *  íconos que la landing (Coins/Gift/Trophy), para que "moneda" se vea igual
 *  en cualquier vista del sitio. */
function PrizeIcon({ type, size = 24 }: { type: string; size?: number }) {
  if (type === "coin") return <Coins size={size} strokeWidth={1.5} />;
  if (type === "gift") return <Gift size={size} strokeWidth={1.5} />;
  return <Trophy size={size} strokeWidth={1.5} />;
}

/** Catálogo informativo -- mismo array `PRIZES` que usa la landing, solo que
 *  con una grilla más compacta para caber dentro del ancho del panel. */
export default function Premios() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Premios</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>
          Los bonos que puedes ganar en la ruleta
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRIZES.map((p) => (
          <div key={p.id} className="rounded-2xl p-5" style={{ background: "#0E0B28", border: "1px solid rgba(255,255,255,0.06)" }}>
            <span
              className="text-xs font-semibold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full inline-block mb-3"
              style={{ background: "rgba(212,168,39,0.1)", color: "#D4A827", border: "1px solid rgba(212,168,39,0.2)" }}
            >
              {p.badge}
            </span>
            <div className="mb-3 p-2 inline-flex rounded-xl" style={{ background: "rgba(212,168,39,0.08)", color: "#D4A827" }}>
              <PrizeIcon type={p.icon} />
            </div>
            <h3 className="font-bold text-white text-base mb-1.5">{p.name}</h3>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(237,232,252,0.45)" }}>{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5 text-center" style={{ background: "rgba(14,11,40,0.6)", border: "1px solid rgba(107,50,214,0.15)" }}>
        <p className="text-sm" style={{ color: "rgba(237,232,252,0.5)" }}>
          Los bonos se redimen únicamente en nuestros casinos físicos, presentando tu documento en caja.
        </p>
      </div>
    </div>
  );
}
