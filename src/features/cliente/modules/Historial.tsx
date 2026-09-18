import { CheckCircle2, Clock, Gift, History } from "lucide-react";
import { Link } from "react-router";
import type { SafeBono } from "@/shared/api/client";

interface HistorialProps {
  bono: SafeBono | null;
}

// timeZone fija a Colombia -- ver la misma nota en admin/modules/VistaGeneral.tsx.
function formatFechaHora(iso: string) {
  return new Date(iso).toLocaleString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Bogota",
  });
}

interface Evento {
  icono: React.ReactNode;
  color: string;
  titulo: string;
  fecha: string;
  detalle: React.ReactNode;
}

/** El historial de un cliente es corto a propósito: solo puede ganar UN
 *  bono en toda su vida (BonoGanado.clienteId es @unique en la base), así
 *  que no hay una lista larga que paginar -- son, como mucho, dos eventos:
 *  cuándo lo ganó y, si ya lo canjeó, cuándo y dónde. Antes esto decía
 *  "Próximamente" sin mostrar nada; ahora sí queda registrado el canje. */
export default function Historial({ bono }: HistorialProps) {
  if (!bono) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(107,50,214,0.08)", color: "rgba(237,232,252,0.35)" }}
        >
          <History size={24} strokeWidth={1.5} />
        </div>
        <h2 className="text-lg font-bold text-white">Todavía no tienes actividad</h2>
        <p className="text-sm mt-1.5 max-w-xs" style={{ color: "rgba(237,232,252,0.4)" }}>
          Gira la ruleta y descubre qué bono te ganaste -- en cuanto lo hagas, tu historial aparece aquí.
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

  const eventos: Evento[] = [
    {
      icono: <Gift size={18} strokeWidth={1.6} />,
      color: "#D4A827",
      titulo: `Ganaste ${bono.premio.nombre}`,
      fecha: formatFechaHora(bono.creadoEn),
      detalle: (
        <>
          Código <span className="font-mono">{bono.codigo}</span>. Asignado a{" "}
          <strong style={{ color: "rgba(237,232,252,0.75)" }}>{bono.sedeAsignada.nombre}</strong> para redimirlo.
        </>
      ),
    },
  ];

  if (bono.estado === "reclamado" && bono.canjeadoEn) {
    eventos.push({
      icono: <CheckCircle2 size={18} strokeWidth={1.6} />,
      color: "#34D399",
      titulo: "Bono canjeado",
      fecha: formatFechaHora(bono.canjeadoEn),
      detalle: (
        <>
          Redimido{bono.sede ? ` en ${bono.sede}` : ""}
          {bono.canjeadoPor ? ` por ${bono.canjeadoPor}` : ""}.
        </>
      ),
    });
  } else {
    eventos.push({
      icono: <Clock size={18} strokeWidth={1.6} />,
      color: "#8B5CE8",
      titulo: "Pendiente por canjear",
      fecha: `Vence el ${formatFechaHora(bono.vigenciaHasta)}`,
      detalle: <>Preséntate en {bono.sedeAsignada.nombre} con tu documento y el código de arriba.</>,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Historial</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>
          El recorrido de tu bono, de principio a fin
        </p>
      </div>

      <div className="relative pl-8">
        {/* Linea vertical que conecta los eventos -- solo tiene sentido con
            2 o mas, por eso no aparece cuando hay uno solo. */}
        {eventos.length > 1 && (
          <div
            className="absolute left-[15px] top-5 bottom-5 w-px"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
        )}

        <div className="space-y-6">
          {eventos.map((ev, i) => (
            <div key={i} className="relative">
              <span
                className="absolute -left-8 top-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "#0E0B28", border: `1px solid ${ev.color}55`, color: ev.color }}
              >
                {ev.icono}
              </span>
              <div className="rounded-2xl p-5" style={{ background: "#0E0B28", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <p className="text-sm font-bold text-white">{ev.titulo}</p>
                  <span className="text-xs" style={{ color: "rgba(237,232,252,0.35)" }}>{ev.fecha}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(237,232,252,0.5)" }}>{ev.detalle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
