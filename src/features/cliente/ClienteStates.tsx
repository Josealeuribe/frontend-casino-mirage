/** Estados de carga/error compartidos entre los módulos del panel de cliente.
 *  Mismo tratamiento visual que `AdminStates.tsx` (panel admin), para que
 *  "/cuenta" no se sienta como una pieza distinta del resto del sitio. */

export function ClienteCargando({ label = "Cargando..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16">
      <p className="text-sm" style={{ color: "rgba(237,232,252,0.4)" }}>{label}</p>
    </div>
  );
}

export function ClienteError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="space-y-3">
      <p
        className="text-sm rounded-xl px-4 py-3"
        style={{ background: "rgba(239,68,68,0.08)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.18)" }}
      >
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-semibold px-4 py-2 rounded-xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(237,232,252,0.6)" }}
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
