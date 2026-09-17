import { useState } from "react";
import { Gift } from "lucide-react";
import { ApiError, cajeroBuscarPorCodigo } from "@/shared/api/client";
import {
  cardStyle,
  ErrorPill,
  formatMonto,
  inputStyle,
  previewToVista,
  ResultadoCanjeCard,
  useConfirmarCanje,
  type ExitoCanje,
  type ResultadoVista,
} from "./ResultadoCanje";

// Mitad "código" del antiguo BuscarCanje.tsx: sin el toggle de modo, porque
// la mitad "documento" ahora es su propia pantalla (BuscarCedula.tsx).
export default function CanjearCodigo() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [buscarError, setBuscarError] = useState("");
  const [resultado, setResultado] = useState<ResultadoVista | null>(null);
  const [exito, setExito] = useState<ExitoCanje | null>(null);

  const { confirming, error: confirmError, setError: setConfirmError, confirmar } = useConfirmarCanje();
  const error = buscarError || confirmError;

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault();
    const codigo = query.trim();
    if (!codigo) return;

    setBuscarError("");
    setConfirmError("");
    setResultado(null);
    setExito(null);
    setLoading(true);
    try {
      const preview = await cajeroBuscarPorCodigo(codigo);
      setResultado(previewToVista(preview));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "No se pudo completar la búsqueda. Intenta de nuevo.";
      setBuscarError(message);
    } finally {
      setLoading(false);
    }
  };

  const onConfirmar = () => {
    if (!resultado) return;
    confirmar(resultado, (ex) => {
      setExito(ex);
      setResultado(null);
      setQuery("");
    });
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="text-center py-2">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ background: "rgba(107,50,214,0.14)" }}
        >
          <Gift size={26} color="#8B5CE8" strokeWidth={1.4} />
        </div>
        <h1 className="text-2xl font-bold text-white">Canjear código de bono</h1>
        <p className="text-sm mt-1.5 max-w-md mx-auto" style={{ color: "rgba(237,232,252,0.45)" }}>
          Ingresa el código que te presenta el cliente para verificarlo antes de canjearlo.
        </p>
      </div>

      {exito && (
        <div
          className="rounded-xl px-5 py-4 flex items-start gap-3"
          style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}
        >
          <span style={{ color: "#10B981", fontSize: "1.25rem", lineHeight: 1 }}>✓</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#6EE7B7" }}>Canje confirmado</p>
            <p className="text-sm mt-0.5" style={{ color: "rgba(237,232,252,0.7)" }}>
              Se entregó <strong>{exito.premio}</strong> ({formatMonto(exito.monto)}) a <strong>{exito.cliente}</strong>.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-xl p-5" style={cardStyle}>
        <form onSubmit={buscar} className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="CCM-2026-XXXXXX"
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "rgba(107,50,214,0.55)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 rounded-xl font-semibold text-sm whitespace-nowrap transition-all"
            style={{
              background: loading || !query.trim() ? "rgba(107,50,214,0.35)" : "linear-gradient(135deg, #6B32D6, #1A5ED8)",
              color: "#fff",
            }}
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>
      </div>

      {error && <ErrorPill message={error} />}

      {resultado && (
        <ResultadoCanjeCard resultado={resultado} sinBono={false} confirming={confirming} onConfirmar={onConfirmar} />
      )}
    </div>
  );
}
