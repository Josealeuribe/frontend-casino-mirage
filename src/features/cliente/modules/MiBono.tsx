import { Link } from "react-router";
import { Gift } from "lucide-react";
import type { SafeBono } from "@/shared/api/client";
import { SEDES, comoLlegarUrl } from "@/shared/data/sedes";

interface MiBonoProps {
  bono: SafeBono | null;
  onNavigate: (mod: string) => void;
}

const ESTADO_STYLE: Record<SafeBono["estado"], { bg: string; color: string; border: string; label: string }> = {
  pendiente: { bg: "rgba(212,168,39,0.1)", color: "#D4A827", border: "rgba(212,168,39,0.3)", label: "Pendiente por canjear" },
  reclamado: { bg: "rgba(16,185,129,0.1)", color: "#34D399", border: "rgba(16,185,129,0.3)", label: "Ya canjeado" },
};

/** El código de redención es LA pieza más importante de toda esta vista:
 *  debe leerse a simple vista, poderse leer en voz alta o mostrar en pantalla
 *  al cajero sin esfuerzo. Por eso va grande, arriba, y solo -- el resto del
 *  detalle (premio, vigencia, sedes) es contexto alrededor de ese número. */
export default function MiBono({ bono, onNavigate }: MiBonoProps) {
  if (!bono) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: "rgba(107,50,214,0.08)", color: "rgba(237,232,252,0.35)" }}
        >
          <Gift size={28} strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-bold text-white">Todavía no tienes un bono</h2>
        <p className="text-sm mt-2" style={{ color: "rgba(237,232,252,0.45)" }}>
          Gira la ruleta y descubre qué bono te ganaste. Solo toma un minuto.
        </p>
        <Link
          to="/jugar"
          className="inline-block mt-5 px-6 py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#6B32D6,#1A5ED8)" }}
        >
          Girar la ruleta
        </Link>
      </div>
    );
  }

  const estado = ESTADO_STYLE[bono.estado];
  const vigencia = new Date(bono.vigenciaHasta);
  const daysLeft = Math.max(0, Math.ceil((vigencia.getTime() - Date.now()) / 86400000));
  const vigenciaLabel = vigencia.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Mi Bono</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>Tu código y el estado de tu premio</p>
      </div>

      {/* Código grande -- el corazón de la vista. */}
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(107,50,214,0.14), rgba(26,94,216,0.08))",
          border: "1px solid rgba(212,168,39,0.32)",
        }}
      >
        <span className="text-xs font-semibold tracking-[0.22em] uppercase" style={{ color: "rgba(237,232,252,0.5)" }}>
          Código de redención
        </span>
        <p
          className="text-5xl md:text-6xl font-black mt-3"
          style={{ color: "#D4A827", letterSpacing: "0.06em", wordBreak: "break-all" }}
        >
          {bono.codigo}
        </p>
        <span
          className="inline-block mt-4 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: estado.bg, color: estado.color, border: `1px solid ${estado.border}` }}
        >
          {estado.label}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5" style={{ background: "#0E0B28", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs uppercase tracking-wider" style={{ color: "rgba(237,232,252,0.38)" }}>Premio</p>
          <p className="text-lg font-bold text-white mt-1">{bono.premio.nombre}</p>
          <p className="text-sm mt-0.5" style={{ color: "rgba(237,232,252,0.45)" }}>{bono.premio.detalle}</p>
          <p className="text-xs mt-2 font-semibold" style={{ color: "#D4A827" }}>
            Valor: ${bono.premio.monto.toLocaleString("es-CO")}
          </p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: "#0E0B28", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs uppercase tracking-wider" style={{ color: "rgba(237,232,252,0.38)" }}>Vigencia</p>
          <p className="text-lg font-bold text-white mt-1">{vigenciaLabel}</p>
          <p className="text-sm mt-0.5" style={{ color: "rgba(237,232,252,0.45)" }}>
            {daysLeft > 0 ? `Quedan ${daysLeft} días` : "Vencido"}
          </p>
        </div>
      </div>

      {bono.estado === "reclamado" ? (
        <div className="rounded-2xl p-5" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)" }}>
          <p className="text-sm font-semibold" style={{ color: "#34D399" }}>Este bono ya fue canjeado</p>
          <p className="text-xs mt-1" style={{ color: "rgba(237,232,252,0.5)" }}>
            {bono.canjeadoEn &&
              `El ${new Date(bono.canjeadoEn).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}`}
            {bono.sede && ` en ${bono.sede}`}
            {bono.canjeadoPor && ` · Atendido por ${bono.canjeadoPor}`}.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl p-6" style={{ background: "#0E0B28", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Dónde redimirlo</h3>
            <button
              onClick={() => onNavigate("sedes")}
              className="text-xs font-semibold"
              style={{ color: "#C4B5FD" }}
            >
              Ver mapa →
            </button>
          </div>
          <p className="text-xs mb-4" style={{ color: "rgba(237,232,252,0.45)" }}>
            Presenta este código y tu documento en caja en cualquiera de nuestras 2 sedes en Arauca.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SEDES.map((sede) => (
              <div key={sede.clave} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-sm font-semibold text-white">{sede.nombre}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(237,232,252,0.45)" }}>{sede.direccion} · {sede.ciudad}</p>
                <a
                  href={comoLlegarUrl(sede)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold underline underline-offset-4 mt-3"
                  style={{ color: "#D4A827" }}
                >
                  Cómo llegar
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
