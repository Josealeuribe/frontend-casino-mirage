import { useState } from "react";
import { ApiError, cambiarPassword, type SafeCliente } from "@/shared/api/client";
import { ClienteError } from "../ClienteStates";

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

// Misma política reforzada en el backend; esto solo adelanta el error antes
// de golpear la API (idéntico criterio a `admin/modules/MiCuenta.tsx`).
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

      {error && <ClienteError message={error} />}

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

interface MiPerfilProps {
  cliente: SafeCliente | null;
}

function Campo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.38)" }}>
        {label}
      </label>
      <input type="text" value={value} readOnly className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inputStyle} />
    </div>
  );
}

/** Solo lectura de los datos propios del cliente + cambio de contraseña real.
 *  No hay endpoint para editar nombre/teléfono/etc., así que no se inventa
 *  uno: esos campos quedan como "readOnly", igual que en `admin/MiCuenta.tsx`.
 *  `SafeCliente` (ver shared/api/client.ts) no trae tipo de documento, solo
 *  el número -- por eso no se muestra "docTipo" aquí. */
export default function MiPerfil({ cliente }: MiPerfilProps) {
  const [editingPassword, setEditingPassword] = useState(false);

  if (!cliente) return null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>
          Tu información y la seguridad de tu cuenta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div style={{ background: "#0E0B28", border: "1px solid rgba(107,50,214,0.22)", borderRadius: "0.875rem", padding: "1.5rem" }}>
          <div className="flex items-center gap-5 mb-6 pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#6B32D6,#1A5ED8)", boxShadow: "0 4px 20px rgba(107,50,214,0.35)" }}
            >
              {cliente.nombres[0]}
            </div>
            <div>
              <p className="text-lg font-bold text-white">{cliente.nombres} {cliente.apellidos}</p>
              <p className="text-sm mt-0.5" style={{ color: "rgba(237,232,252,0.4)" }}>Cliente · Centro Club Mirage</p>
            </div>
          </div>

          <div className="space-y-4">
            <Campo label="Nombres" value={cliente.nombres} />
            <Campo label="Apellidos" value={cliente.apellidos} />
            <Campo label="Email" value={cliente.email} />
            <Campo label="Documento" value={cliente.docNumero} />
            <Campo label="Teléfono" value={cliente.telefono} />
            <Campo label="Departamento" value={cliente.departamento} />
            <Campo label="Ciudad" value={cliente.ciudad} />
          </div>
        </div>

        <div style={{ background: "#0E0B28", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.875rem", padding: "1.5rem" }}>
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
                Cambiar
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
