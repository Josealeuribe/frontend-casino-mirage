import { ChevronLeft, ChevronRight } from "lucide-react";

export const REGISTROS_POR_PAGINA = 20;

interface PaginadorProps {
  pagina: number;
  totalPaginas: number;
  totalItems: number;
  porPagina: number;
  onCambiar: (pagina: number) => void;
}

// Rango de numeros de pagina a mostrar: siempre la primera, la ultima, la
// actual y sus vecinas inmediatas -- el resto se resume con "...". Con pocas
// paginas (el caso normal aqui) simplemente se ven todas.
function rangoPaginas(pagina: number, total: number): (number | "...")[] {
  const paginas = new Set<number>([1, total, pagina, pagina - 1, pagina + 1]);
  const ordenadas = [...paginas].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const resultado: (number | "...")[] = [];
  for (let i = 0; i < ordenadas.length; i++) {
    if (i > 0 && ordenadas[i] - ordenadas[i - 1] > 1) resultado.push("...");
    resultado.push(ordenadas[i]);
  }
  return resultado;
}

/** Paginador compartido por Clientes y Auditoría de Canjes -- 20 registros
 *  por página en las dos tablas (ver REGISTROS_POR_PAGINA). No aparece en
 *  absoluto si todo cabe en una sola página. */
export default function Paginador({ pagina, totalPaginas, totalItems, porPagina, onCambiar }: PaginadorProps) {
  if (totalPaginas <= 1) return null;

  const desde = (pagina - 1) * porPagina + 1;
  const hasta = Math.min(pagina * porPagina, totalItems);

  const botonEstilo = (activo: boolean, deshabilitado: boolean): React.CSSProperties => ({
    background: activo ? "rgba(107,50,214,0.25)" : "rgba(255,255,255,0.03)",
    color: activo ? "#C4B5FD" : deshabilitado ? "rgba(237,232,252,0.2)" : "rgba(237,232,252,0.6)",
    border: `1px solid ${activo ? "rgba(107,50,214,0.4)" : "rgba(255,255,255,0.07)"}`,
    cursor: deshabilitado ? "not-allowed" : "pointer",
  });

  return (
    <div className="flex items-center justify-between px-4 py-3 flex-wrap gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <p className="text-xs" style={{ color: "rgba(237,232,252,0.35)" }}>
        Mostrando {desde}–{hasta} de {totalItems}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onCambiar(pagina - 1)}
          disabled={pagina === 1}
          aria-label="Página anterior"
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={botonEstilo(false, pagina === 1)}
        >
          <ChevronLeft size={14} strokeWidth={2} />
        </button>

        {rangoPaginas(pagina, totalPaginas).map((p, i) =>
          p === "..." ? (
            <span key={`gap-${i}`} className="w-8 text-center text-xs" style={{ color: "rgba(237,232,252,0.25)" }}>
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onCambiar(p)}
              className="w-8 h-8 rounded-lg text-xs font-semibold transition-colors"
              style={botonEstilo(p === pagina, false)}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onCambiar(pagina + 1)}
          disabled={pagina === totalPaginas}
          aria-label="Página siguiente"
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={botonEstilo(false, pagina === totalPaginas)}
        >
          <ChevronRight size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
