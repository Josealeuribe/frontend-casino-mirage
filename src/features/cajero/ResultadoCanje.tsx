import { useState } from "react";
import { ApiError, cajeroConfirmarCanje, type CanjePreview } from "@/shared/api/client";

// Pieza compartida entre CanjearCodigo.tsx y BuscarCedula.tsx: ambas terminan
// mostrando la misma tarjeta de resultado y pueden confirmar el mismo canje,
// así que la vista, la normalización y el flujo de confirmación viven aquí
// una sola vez en lugar de duplicarse en los dos componentes.
export interface ResultadoVista {
  codigo: string | null;
  estado: "pendiente" | "reclamado" | null;
  vigenciaHasta: string | null;
  vencido: boolean;
  premio: { nombre: string; detalle: string; monto: number } | null;
  cliente: {
    nombres: string;
    apellidos: string;
    docTipo: string;
    docNumero: string;
    email: string;
    telefono: string;
    departamento: string;
    ciudad: string;
  };
  // Sede a la que este bono quedo asignado desde que se gano (reparto
  // equitativo) -- es la unica sede donde el cajero puede confirmar el
  // canje; el backend rechaza el intento si la sede del cajero no coincide.
  sedeAsignada: { nombre: string; direccion: string } | null;
  sedeCanje: string | null;
  canjeadoPor: string | null;
}

export function previewToVista(p: CanjePreview): ResultadoVista {
  return {
    codigo: p.codigo,
    estado: p.estado,
    vigenciaHasta: p.vigenciaHasta,
    vencido: p.vencido,
    premio: p.premio,
    cliente: p.cliente,
    sedeAsignada: p.sedeAsignada,
    sedeCanje: p.sedeCanje,
    canjeadoPor: p.canjeadoPor,
  };
}

export const cardStyle: React.CSSProperties = {
  background: "#0E0B28",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "0.875rem",
};

export const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  outline: "none",
  width: "100%",
  borderRadius: "0.75rem",
  padding: "0.85rem 1.1rem",
  color: "#EDE8FC",
  fontSize: "1rem",
  transition: "border-color 0.2s",
};

export function formatMonto(monto: number) {
  return `$${monto.toLocaleString("es-CO")}`;
}

// timeZone fija a Colombia -- ver la misma nota en admin/modules/VistaGeneral.tsx.
export function formatFecha(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("es-CO", { timeZone: "America/Bogota" });
  } catch {
    return iso;
  }
}

export interface ExitoCanje {
  premio: string;
  monto: number;
  cliente: string;
}

/** Encapsula el diálogo de confirmación (acción irreversible) y la llamada a
 *  cajeroConfirmarCanje. Cada pantalla decide qué hacer con el resultado
 *  (limpiar su propio input, etc.) a través del callback onExito. */
export function useConfirmarCanje() {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const confirmar = async (resultado: ResultadoVista, onExito: (exito: ExitoCanje) => void) => {
    if (!resultado.codigo) return;
    const nombreCompleto = `${resultado.cliente.nombres} ${resultado.cliente.apellidos}`;
    const premioNombre = resultado.premio?.nombre ?? "este premio";
    const ok = window.confirm(`¿Confirmar la entrega de "${premioNombre}" a ${nombreCompleto}?`);
    if (!ok) return;

    setConfirming(true);
    setError("");
    try {
      const res = await cajeroConfirmarCanje(resultado.codigo);
      onExito({ premio: res.premio.nombre, monto: res.premio.monto, cliente: nombreCompleto });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "No se pudo confirmar el canje. Intenta de nuevo.";
      setError(message);
    } finally {
      setConfirming(false);
    }
  };

  return { confirming, error, setError, confirmar };
}

interface ResultadoCanjeCardProps {
  resultado: ResultadoVista;
  sinBono: boolean;
  confirming: boolean;
  onConfirmar: () => void;
}

export function ResultadoCanjeCard({ resultado, sinBono, confirming, onConfirmar }: ResultadoCanjeCardProps) {
  const puedeConfirmar = !!resultado.codigo && resultado.estado === "pendiente" && !resultado.vencido;

  return (
    <div className="rounded-xl p-6" style={cardStyle}>
      {/* Identidad del cliente -- lo mas importante de la tarjeta: el
          cajero lo compara contra la cédula física frente a él. */}
      <div className="mb-5 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-xs uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.35)" }}>
          Cliente
        </p>
        <p className="text-3xl font-bold text-white leading-tight">
          {resultado.cliente.nombres} {resultado.cliente.apellidos}
        </p>
        <p className="text-xl font-semibold mt-1" style={{ color: "#D4A827" }}>
          {resultado.cliente.docTipo}: {resultado.cliente.docNumero}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-xs" style={{ color: "rgba(237,232,252,0.4)" }}>
          <span>{resultado.cliente.email}</span>
          <span>{resultado.cliente.telefono}</span>
          <span>{resultado.cliente.ciudad}, {resultado.cliente.departamento}</span>
        </div>
      </div>

      {sinBono ? (
        <p className="text-sm" style={{ color: "rgba(237,232,252,0.5)" }}>
          Este cliente no tiene un bono asignado todavía.
        </p>
      ) : (
        resultado.premio && (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.35)" }}>
                  Premio
                </p>
                <p className="text-lg font-bold text-white">{resultado.premio.nombre}</p>
                <p className="text-sm" style={{ color: "rgba(237,232,252,0.45)" }}>{resultado.premio.detalle}</p>
                <p className="text-xl font-bold mt-1" style={{ color: "#D4A827" }}>{formatMonto(resultado.premio.monto)}</p>
              </div>
              <div className="text-right">
                <span
                  className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={
                    resultado.estado === "reclamado"
                      ? { background: "rgba(255,255,255,0.05)", color: "rgba(237,232,252,0.4)" }
                      : { background: "rgba(16,185,129,0.12)", color: "#6EE7B7" }
                  }
                >
                  {resultado.estado === "reclamado" ? "Ya reclamado" : "Pendiente"}
                </span>
                <p className="text-xs mt-1.5 font-mono" style={{ color: "rgba(237,232,252,0.3)" }}>
                  {resultado.codigo}
                </p>
              </div>
            </div>

            {resultado.sedeAsignada && resultado.estado === "pendiente" && (
              <p
                className="text-sm rounded-lg px-4 py-3 mb-4"
                style={{ background: "rgba(107,50,214,0.08)", color: "#C4B5FD", border: "1px solid rgba(107,50,214,0.22)" }}
              >
                Asignado a <strong>{resultado.sedeAsignada.nombre}</strong> ({resultado.sedeAsignada.direccion}) --
                solo se puede confirmar el canje desde esa sede.
              </p>
            )}

            {resultado.vencido && (
              <p
                className="text-sm rounded-lg px-4 py-3 mb-4"
                style={{ background: "rgba(239,68,68,0.08)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.18)" }}
              >
                Este bono venció el {formatFecha(resultado.vigenciaHasta)} y ya no se puede canjear.
              </p>
            )}

            {resultado.estado === "reclamado" && (
              <p className="text-sm mb-4" style={{ color: "rgba(237,232,252,0.45)" }}>
                Canjeado {resultado.sedeCanje ? `en ${resultado.sedeCanje} ` : ""}
                {resultado.canjeadoPor ? `por ${resultado.canjeadoPor}` : ""}.
              </p>
            )}

            <button
              onClick={onConfirmar}
              disabled={!puedeConfirmar || confirming}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all"
              style={{
                background: !puedeConfirmar || confirming
                  ? "rgba(107,50,214,0.25)"
                  : "linear-gradient(135deg, #6B32D6, #1A5ED8)",
                color: puedeConfirmar ? "#fff" : "rgba(237,232,252,0.4)",
                cursor: !puedeConfirmar || confirming ? "not-allowed" : "pointer",
              }}
            >
              {confirming ? "Confirmando..." : "Confirmar canje"}
            </button>
          </>
        )
      )}
    </div>
  );
}

export function ErrorPill({ message }: { message: string }) {
  return (
    <p
      className="text-sm rounded-lg px-4 py-3"
      style={{ background: "rgba(239,68,68,0.08)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.18)" }}
    >
      {message}
    </p>
  );
}
