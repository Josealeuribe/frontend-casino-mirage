import { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { ApiError, cambiarPassword } from "@/shared/api/client";
import { ErrorPill } from "./ResultadoCanje";

const card: React.CSSProperties = {
  background: "#0E0B28",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "0.875rem",
  padding: "1.5rem",
};

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  outline: "none",
  width: "100%",
  borderRadius: "0.75rem",
  padding: "0.65rem 1rem",
  color: "rgba(237,232,252,0.7)",
  fontSize: "0.875rem",
};

// Política de contraseña reforzada también en el backend; esta validación
// solo mejora la experiencia mostrando el error antes de golpear la API.
// (Misma política que frontend/src/features/admin/modules/MiCuenta.tsx.)
function validarPassword(pass: string): string | null {
  if (pass.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (!/[A-Z]/.test(pass)) return "La contraseña debe incluir al menos una mayúscula.";
  if (!/[0-9]/.test(pass)) return "La contraseña debe incluir al menos un número.";
  return null;
}

function CambiarPasswordForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

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
      setOk(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo cambiar la contraseña.");
    } finally {
      setSubmitting(false);
    }
  };

  if (ok) {
    return (
      <div className="mt-3 space-y-3">
        <p
          className="text-sm rounded-xl px-4 py-3"
          style={{ background: "rgba(16,185,129,0.08)", color: "#34D399", border: "1px solid rgba(16,185,129,0.18)" }}
        >
          Contraseña actualizada correctamente.
        </p>
        <button
          onClick={onDone}
          className="px-4 py-2 rounded-xl text-xs font-medium"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(237,232,252,0.6)" }}
        >
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-3">
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.38)" }}>
          Contraseña actual
        </label>
        <input type="password" value={actual} onChange={(e) => setActual(e.target.value)} style={inputStyle} required />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.38)" }}>
          Nueva contraseña
        </label>
        <input type="password" value={nueva} onChange={(e) => setNueva(e.target.value)} style={inputStyle} required />
        <p className="text-xs mt-1" style={{ color: "rgba(237,232,252,0.3)" }}>Mínimo 8 caracteres, 1 mayúscula y 1 número.</p>
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.38)" }}>
          Confirmar nueva contraseña
        </label>
        <input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} style={inputStyle} required />
      </div>

      {error && <ErrorPill message={error} />}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#6B32D6,#1A5ED8)" }}
        >
          {submitting ? "Guardando..." : "Guardar contraseña"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2.5 rounded-xl text-sm"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(237,232,252,0.6)" }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default function MiCuenta() {
  const { user } = useAuth();
  const [editingPassword, setEditingPassword] = useState(false);

  const roleLabel = user?.role === "admin" ? "Administrador" : "Cajero";
  const sedeLabel = user?.sede ? user.sede.nombre : "Centro Club Mirage — Todas las sedes";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Mi Cuenta</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>
          Configuración de perfil del mostrador de canjes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Profile card */}
        <div style={{ ...card, border: "1px solid rgba(107,50,214,0.22)" }}>
          <div
            className="flex items-center gap-5 mb-6 pb-6"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
              style={{
                background: "linear-gradient(135deg,#6B32D6,#1A5ED8)",
                boxShadow: "0 4px 20px rgba(107,50,214,0.35)",
              }}
            >
              {user?.name?.[0] ?? "C"}
            </div>
            <div>
              <p className="text-lg font-bold text-white">{user?.name ?? "Cajero"}</p>
              <p className="text-sm mt-0.5" style={{ color: "rgba(237,232,252,0.4)" }}>
                {roleLabel} · {sedeLabel}
              </p>
              <span
                className="text-xs px-2.5 py-1 rounded-full inline-block mt-2"
                style={{ background: "rgba(107,50,214,0.12)", color: "#C4B5FD", border: "1px solid rgba(107,50,214,0.22)" }}
              >
                Acceso de mostrador
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.38)" }}>
                Nombre
              </label>
              <input type="text" value={user?.name ?? ""} readOnly className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.38)" }}>
                Email
              </label>
              <input type="email" value={user?.email ?? ""} readOnly className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.38)" }}>
                Sede asignada
              </label>
              <input type="text" value={sedeLabel} readOnly className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={{ ...card, padding: "1.5rem" }}>
          <h2 className="text-sm font-bold text-white mb-1">Seguridad</h2>
          <p className="text-xs mb-4" style={{ color: "rgba(237,232,252,0.4)" }}>
            Cambia tu contraseña cuando quieras.
          </p>
          {!editingPassword ? (
            <div className="flex items-center gap-3">
              <input type="password" value="••••••••" readOnly className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none" style={inputStyle} />
              <button
                onClick={() => setEditingPassword(true)}
                className="text-xs px-3 py-2 rounded-xl transition-colors whitespace-nowrap"
                style={{ background: "rgba(107,50,214,0.1)", border: "1px solid rgba(107,50,214,0.2)", color: "#C4B5FD" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(107,50,214,0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(107,50,214,0.1)"; }}
              >
                Editar
              </button>
            </div>
          ) : (
            <CambiarPasswordForm onDone={() => setEditingPassword(false)} onCancel={() => setEditingPassword(false)} />
          )}
        </div>
      </div>
    </div>
  );
}
