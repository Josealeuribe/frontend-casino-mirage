import { useEffect, useState, type ReactNode } from "react";
import { CalendarClock, Gift, History, MapPin, Trophy } from "lucide-react";
import { fetchVigenciaPromocion, type SafeBono, type SafeCliente } from "@/shared/api/client";
import { SEDES } from "@/shared/data/sedes";

interface InicioProps {
  cliente: SafeCliente | null;
  bono: SafeBono | null;
  onNavigate: (mod: string) => void;
}

function StatCard({ icon, value, label, onClick }: { icon: ReactNode; value: string | number; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-2xl p-5 transition-colors"
      style={{ background: "#0E0B28", border: "1px solid rgba(255,255,255,0.06)" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(107,50,214,0.28)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
    >
      <div className="mb-3 p-2 inline-flex rounded-xl" style={{ background: "rgba(107,50,214,0.1)", color: "#8B5CE8" }}>
        {icon}
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-xs mt-1 truncate" style={{ color: "rgba(237,232,252,0.4)" }}>{label}</p>
    </button>
  );
}

/** Panel "Inicio" del cliente -- mismo orden de bloques que la referencia:
 *  saludo, vigencia de la promoción, tarjeta del premio ganado (si tiene) y
 *  3 tarjetas de estadística. La referencia tenía "Bingos" en el segundo
 *  puesto; este producto no tiene ese concepto, así que ahí va "Sedes", que
 *  es justo el dato que el dueño del proyecto pidió explícitamente que el
 *  cliente pudiera encontrar. */
export default function Inicio({ cliente, bono, onNavigate }: InicioProps) {
  const [vigenciaHasta, setVigenciaHasta] = useState<Date | null>(null);

  useEffect(() => {
    fetchVigenciaPromocion()
      .then((r) => setVigenciaHasta(r.vigenciaHasta ? new Date(r.vigenciaHasta) : null))
      .catch(() => {});
  }, []);

  const daysLeft = vigenciaHasta ? Math.max(0, Math.ceil((vigenciaHasta.getTime() - Date.now()) / 86400000)) : null;
  // timeZone fija a Colombia -- ver la misma nota en admin/modules/VistaGeneral.tsx.
  const vigenciaLabel = vigenciaHasta
    ? vigenciaHasta.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Bogota" })
    : null;

  const nombre = cliente?.nombres ?? "";

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold tracking-[0.22em] uppercase" style={{ color: "#D4A827" }}>
          Bienvenido
        </span>
        <h1 className="text-3xl font-black text-white mt-2" style={{ letterSpacing: "-0.01em" }}>
          Hola, {nombre}
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.45)" }}>
          Este es el estado real de tu cuenta
        </p>
      </div>

      {vigenciaLabel && (
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-4"
          style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.16)" }}
        >
          <span className="flex-shrink-0" style={{ color: "#10B981" }}>
            <CalendarClock size={20} strokeWidth={1.5} />
          </span>
          <div>
            <p className="text-xs" style={{ color: "rgba(237,232,252,0.45)" }}>Vigencia de la promoción</p>
            <p className="text-sm mt-0.5" style={{ color: "rgba(237,232,252,0.75)" }}>
              Hasta el <strong style={{ color: "#34D399" }}>{vigenciaLabel}</strong> · Quedan {daysLeft} días
            </p>
          </div>
        </div>
      )}

      {bono && (
        <div
          className="rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap"
          style={{ background: "rgba(212,168,39,0.06)", border: "1px solid rgba(212,168,39,0.32)" }}
        >
          <div className="flex items-start gap-4">
            <span className="flex-shrink-0 mt-0.5" style={{ color: "#D4A827" }}>
              <Trophy size={26} strokeWidth={1.5} />
            </span>
            <div>
              <span className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: "#D4A827" }}>
                Premio ganado
              </span>
              <p className="text-lg font-bold text-white mt-1">{bono.premio.nombre}</p>
              <p className="text-xs mt-1" style={{ color: "rgba(237,232,252,0.45)" }}>
                Código {bono.codigo} ·{" "}
                {bono.estado === "reclamado"
                  ? `Ya fue canjeado${bono.sede ? ` en ${bono.sede}` : ""}.`
                  : `Redímelo en ${bono.sedeAsignada.nombre}, la sede que te asignamos.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("mi-bono")}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#6B32D6,#1A5ED8)" }}
          >
            Ver →
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          onClick={() => onNavigate("mi-bono")}
          value={bono ? 1 : 0}
          label={bono ? bono.premio.nombre : "Sin bono aún"}
          icon={<Gift size={20} strokeWidth={1.5} />}
        />
        <StatCard
          onClick={() => onNavigate("sedes")}
          value={bono ? 1 : SEDES.length}
          label={bono ? `Sede asignada: ${bono.sedeAsignada.nombre}` : "Sedes en Arauca"}
          icon={<MapPin size={20} strokeWidth={1.5} />}
        />
        <StatCard
          onClick={() => onNavigate("historial")}
          value={bono ? (bono.estado === "reclamado" ? 2 : 1) : 0}
          label={bono ? (bono.estado === "reclamado" ? "Bono ganado y canjeado" : "Bono ganado, por canjear") : "Sin actividad aún"}
          icon={<History size={20} strokeWidth={1.5} />}
        />
      </div>
    </div>
  );
}
