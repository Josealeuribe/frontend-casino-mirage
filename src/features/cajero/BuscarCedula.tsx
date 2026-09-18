import { useState } from "react";
import { IdCard } from "lucide-react";
import { ApiError, cajeroBuscarPorDocumento } from "@/shared/api/client";
import {
  cardStyle,
  ErrorPill,
  formatMonto,
  inputStyle,
  ResultadoCanjeCard,
  useConfirmarCanje,
  type ExitoCanje,
  type ResultadoVista,
} from "./ResultadoCanje";

// Mitad "documento" del antiguo BuscarCanje.tsx: sin el toggle de modo, y
// como propia pantalla puede terminar en el mismo confirmar() -- si el
// cliente ya tiene un bono pendiente, el cajero lo confirma desde aquí mismo
// sin tener que saltar a la pantalla de "Canjear Código" a copiar nada.
export default function BuscarCedula() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [buscarError, setBuscarError] = useState("");
  const [resultado, setResultado] = useState<ResultadoVista | null>(null);
  const [sinBono, setSinBono] = useState(false);
  const [exito, setExito] = useState<ExitoCanje | null>(null);

  const { confirming, error: confirmError, setError: setConfirmError, confirmar } = useConfirmarCanje();
  const error = buscarError || confirmError;

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault();
    const docNumero = query.trim();
    if (!docNumero) return;

    setBuscarError("");
    setConfirmError("");
    setResultado(null);
    setSinBono(false);
    setExito(null);
    setLoading(true);
    try {
      const encontrado = await cajeroBuscarPorDocumento(docNumero);
      if (encontrado.bono) {
        setResultado({
          codigo: encontrado.bono.codigo,
          estado: encontrado.bono.estado,
          vigenciaHasta: encontrado.bono.vigenciaHasta,
          vencido: encontrado.bono.vencido,
          premio: encontrado.bono.premio,
          cliente: encontrado.cliente,
          sedeAsignada: encontrado.bono.sedeAsignada,
          sedeCanje: encontrado.bono.sede,
          canjeadoPor: encontrado.bono.canjeadoPor,
        });
      } else {
        setSinBono(true);
        setResultado({
          codigo: null,
          estado: null,
          vigenciaHasta: null,
          vencido: false,
          premio: null,
          cliente: encontrado.cliente,
          sedeAsignada: null,
          sedeCanje: null,
          canjeadoPor: null,
        });
      }
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
      setSinBono(false);
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
          <IdCard size={26} color="#8B5CE8" strokeWidth={1.4} />
        </div>
        <h1 className="text-2xl font-bold text-white">Buscar cliente por cédula</h1>
        <p className="text-sm mt-1.5 max-w-md mx-auto" style={{ color: "rgba(237,232,252,0.45)" }}>
          Ingresa el número de documento del cliente para consultar si tiene un bono pendiente por canjear.
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
            placeholder="Número de documento"
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
        <ResultadoCanjeCard resultado={resultado} sinBono={sinBono} confirming={confirming} onConfirmar={onConfirmar} />
      )}
    </div>
  );
}
