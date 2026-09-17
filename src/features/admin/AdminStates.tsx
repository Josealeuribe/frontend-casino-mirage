/** Estados de carga/error compartidos entre los módulos del panel admin. */

export function AdminCargando({ label = "Cargando..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16">
      <p className="text-sm" style={{ color: "rgba(237,232,252,0.4)" }}>{label}</p>
    </div>
  );
}

export function AdminError({ message }: { message: string }) {
  return (
    <p
      className="text-sm rounded-xl px-4 py-3"
      style={{ background: "rgba(239,68,68,0.08)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.18)" }}
    >
      {message}
    </p>
  );
}
