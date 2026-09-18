import { useState } from "react";
import { KeyRound } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { ApiError, cambiarPassword } from "@/shared/api/client";

// Misma politica que exige el backend (ver passwordSchema en
// auth.routes.ts) -- esto solo adelanta el error antes de golpear la API.
function validarPassword(pass: string): string | null {
  if (pass.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (!/[A-Z]/.test(pass)) return "La contraseña debe incluir al menos una mayúscula.";
  if (!/[0-9]/.test(pass)) return "La contraseña debe incluir al menos un número.";
  return null;
}

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  outline: "none",
  width: "100%",
  borderRadius: "0.75rem",
  padding: "0.75rem 1rem",
  color: "#EDE8FC",
  fontSize: "0.875rem",
  transition: "border-color 0.2s",
};

/** Modal OBLIGATORIO de cambio de contraseña -- sin boton de cerrar, sin
 *  clic-afuera-para-cerrar, sin "cancelar". Se monta automaticamente en
 *  AdminLayout/CajeroLayout apenas la sesion trae `debeCambiarPassword` en
 *  true (clave temporal asignada por un administrador, ver
 *  admin.routes.ts POST /usuarios y /usuarios/:id/restablecer-password) --
 *  no se puede seguir usando el panel sin cambiarla primero. */
export default function CambiarPasswordObligatorioModal() {
  const { marcarPasswordCambiada } = useAuth();
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (nueva !== confirmar) {
      setError("La nueva contraseña y la confirmación no coinciden.");
      return;
    }
    const policyError = validarPassword(nueva);
    if (policyError) {
      setError(policyError);
      return;
    }

    setSubmitting(true);
    try {
      await cambiarPassword({ actual, nueva, confirmar });
      marcarPasswordCambiada();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo cambiar la contraseña. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(4,3,14,0.92)", backdropFilter: "blur(10px)" }}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #130E2E 0%, #0E0B28 100%)",
          border: "1px solid rgba(212,168,39,0.3)",
          boxShadow: "0 40px 100px rgba(4,3,16,0.8), 0 0 80px rgba(212,168,39,0.08)",
        }}
      >
        <div
          className="pt-8 pb-6 px-8 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(212,168,39,0.12) 100%)",
            borderBottom: "1px solid rgba(212,168,39,0.15)",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(212,168,39,0.12)", color: "#D4A827" }}
          >
            <KeyRound size={26} strokeWidth={1.6} />
          </div>
          <h2 className="text-xl font-bold text-white">Debes cambiar tu contraseña</h2>
          <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "rgba(237,232,252,0.5)" }}>
            Tu cuenta tiene una contraseña temporal. Crea una nueva para poder continuar.
          </p>
        </div>

        <form onSubmit={submit} className="px-8 pt-6 pb-8 space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.4)" }}>
              Contraseña actual
            </label>
            <input
              type="password"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "rgba(212,168,39,0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.4)" }}>
              Nueva contraseña
            </label>
            <input
              type="password"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "rgba(212,168,39,0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
              required
            />
            <p className="text-xs mt-1.5" style={{ color: "rgba(237,232,252,0.35)" }}>
              Mínimo 8 caracteres, 1 mayúscula y 1 número.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.4)" }}>
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "rgba(212,168,39,0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
              required
            />
          </div>

          {error && (
            <p
              className="text-xs rounded-lg px-3 py-2.5"
              style={{ background: "rgba(239,68,68,0.08)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.18)" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 disabled:cursor-not-allowed"
            style={{
              background: submitting ? "rgba(107,50,214,0.4)" : "linear-gradient(135deg, #6B32D6 0%, #1A5ED8 100%)",
              boxShadow: submitting ? "none" : "0 6px 24px rgba(107,50,214,0.35)",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              if (submitting) return;
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(107,50,214,0.55)";
            }}
            onMouseLeave={(e) => {
              if (submitting) return;
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(107,50,214,0.35)";
            }}
          >
            {submitting ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
