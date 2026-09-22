/** Fila de una tarjeta de info (label a la izquierda, valor a la derecha,
 *  con un subtexto opcional debajo del valor) -- reemplazo del <td> de una
 *  tabla para la vista en tarjetas de un módulo en celular. Compartida entre
 *  Clientes y AuditoriaCanjes porque ambas tarjetas siguen exactamente el
 *  mismo patrón visual (ver la referencia que dio el cliente). */
export default function FilaInfo({
  label,
  value,
  sub,
  valueColor,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  valueColor?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <span className="text-xs shrink-0 pt-0.5" style={{ color: "rgba(237,232,252,0.35)" }}>{label}</span>
      <div className="text-right min-w-0">
        <p className="text-sm font-medium break-words" style={{ color: valueColor ?? "rgba(237,232,252,0.85)" }}>{value}</p>
        {sub && <p className="text-xs mt-0.5 break-words" style={{ color: "rgba(237,232,252,0.35)" }}>{sub}</p>}
      </div>
    </div>
  );
}
