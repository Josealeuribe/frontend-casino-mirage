import { History } from "lucide-react";

/** Placeholder honesto: en el proyecto hermano que sirvió de referencia
 *  visual este mismo módulo ya decía "Próximamente" sin estar implementado.
 *  Aquí no hay todavía un historial de actividad del cliente que valga la
 *  pena mostrar (su único evento relevante -- el canje -- ya se ve completo
 *  en "Mi Bono"), así que se deja el mismo tratamiento en vez de inventar
 *  contenido de relleno. */
export default function Historial() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{ background: "rgba(107,50,214,0.08)", color: "rgba(237,232,252,0.35)" }}
      >
        <History size={24} strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-bold text-white">Historial</h2>
      <p className="text-sm mt-1.5" style={{ color: "rgba(237,232,252,0.4)" }}>Próximamente</p>
    </div>
  );
}
