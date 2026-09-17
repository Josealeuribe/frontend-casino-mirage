import { useState } from "react";
import { Plus } from "lucide-react";
import {
  ApiError,
  adminCrearUsuario,
  adminFetchUsuarios,
  adminRestablecerPassword,
  cajeroFetchSedes,
  type AdminUsuario,
} from "@/shared/api/client";
import { useAdminFetch } from "../useAdminFetch";
import { AdminCargando, AdminError } from "../AdminStates";

const AVATAR_COLORS = ["#6B32D6", "#1A5ED8", "#00C4D8", "#10B981", "#D4A827"];

const card: React.CSSProperties = {
  background: "#0E0B28",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "0.875rem",
};

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  outline: "none",
  width: "100%",
  borderRadius: "0.75rem",
  padding: "0.65rem 1rem",
  color: "#EDE8FC",
  fontSize: "0.875rem",
};

function TemporalPasswordBanner({ nombre, temporal, onClose }: { nombre: string; temporal: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(4,3,14,0.88)", backdropFilter: "blur(10px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl p-6"
        style={{
          background: "linear-gradient(145deg, #120E30 0%, #1A1445 100%)",
          border: "1px solid rgba(16,185,129,0.3)",
          boxShadow: "0 32px 80px rgba(4,3,14,0.8)",
        }}
      >
        <h3 className="text-sm font-bold text-white mb-1">Contraseña temporal para {nombre}</h3>
        <p className="text-xs mb-4" style={{ color: "rgba(237,232,252,0.45)" }}>
          Cópiala ahora: no se volverá a mostrar. Si se pierde, usa "Restablecer contraseña" para generar otra.
        </p>
        <div
          className="text-lg font-mono font-bold text-center py-3 rounded-xl mb-4 select-all"
          style={{ background: "rgba(16,185,129,0.08)", color: "#34D399", border: "1px solid rgba(16,185,129,0.2)" }}
        >
          {temporal}
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl font-semibold text-sm text-white"
          style={{ background: "linear-gradient(135deg,#6B32D6,#1A5ED8)" }}
        >
          Ya la copié
        </button>
      </div>
    </div>
  );
}

function AgregarMiembroModal({
  sedes,
  onCancel,
  onCreated,
}: {
  sedes: { clave: string; nombre: string }[];
  onCancel: () => void;
  onCreated: (nombre: string, temporal: string) => void;
}) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState<"admin" | "cajero">("cajero");
  const [sedeClave, setSedeClave] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) {
      setError("Nombre y email son obligatorios.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await adminCrearUsuario({
        nombre: nombre.trim(),
        email: email.trim(),
        rol,
        sedeClave: sedeClave || undefined,
      });
      onCreated(res.usuario.nombre, res.temporal);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo crear el usuario.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(4,3,14,0.88)", backdropFilter: "blur(10px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl p-7"
        style={{
          background: "linear-gradient(145deg, #120E30 0%, #1A1445 100%)",
          border: "1px solid rgba(107,50,214,0.28)",
          boxShadow: "0 32px 80px rgba(4,3,14,0.8)",
        }}
      >
        <h3 className="text-lg font-bold text-white mb-4">Agregar miembro</h3>
        <form onSubmit={submit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.4)" }}>Nombre</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} style={inputStyle} required />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.4)" }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.4)" }}>Rol</label>
            <select value={rol} onChange={(e) => setRol(e.target.value as "admin" | "cajero")} style={inputStyle}>
              <option value="cajero">Cajero</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.4)" }}>Sede</label>
            <select value={sedeClave} onChange={(e) => setSedeClave(e.target.value)} style={inputStyle}>
              <option value="">Sin sede asignada</option>
              {sedes.map((s) => (
                <option key={s.clave} value={s.clave}>{s.nombre}</option>
              ))}
            </select>
          </div>

          {error && <AdminError message={error} />}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#6B32D6,#1A5ED8)" }}
            >
              {submitting ? "Creando..." : "Crear usuario"}
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
      </div>
    </div>
  );
}

export default function Personal() {
  const { data, loading, error, setData } = useAdminFetch(adminFetchUsuarios);
  const { data: sedesData } = useAdminFetch(cajeroFetchSedes);
  const [showAddModal, setShowAddModal] = useState(false);
  const [tempPassword, setTempPassword] = useState<{ nombre: string; temporal: string } | null>(null);
  const [resettingId, setResettingId] = useState<number | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  if (loading) return <AdminCargando />;
  if (error) return <AdminError message={error} />;
  if (!data) return null;

  const usuarios = data.usuarios;
  const sedes = sedesData?.sedes ?? [];

  const reload = async () => {
    const result = await adminFetchUsuarios();
    setData(result);
  };

  const handleResetPassword = async (u: AdminUsuario) => {
    setResettingId(u.id);
    setResetError(null);
    try {
      const res = await adminRestablecerPassword(u.id);
      setTempPassword({ nombre: res.usuario.nombre, temporal: res.temporal });
    } catch (err) {
      setResetError(err instanceof ApiError ? err.message : "No se pudo restablecer la contraseña.");
    } finally {
      setResettingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Personal</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>Gestión de cajeros y administradores</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: "rgba(107,50,214,0.12)", border: "1px solid rgba(107,50,214,0.28)", color: "#C4B5FD" }}
        >
          <Plus size={13} />
          Agregar miembro
        </button>
      </div>

      {resetError && <AdminError message={resetError} />}

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3.5">
        {[
          { label: "Total personal", value: usuarios.length },
          { label: "Activos", value: usuarios.filter((p) => p.activo).length },
          { label: "Canjes procesados", value: usuarios.reduce((a, p) => a + p.canjes, 0) },
        ].map((kpi, i) => (
          <div key={i} className="rounded-xl p-4 text-center" style={card}>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            <p className="text-xs mt-1" style={{ color: "rgba(237,232,252,0.38)" }}>{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {usuarios.map((p, idx) => (
          <div
            key={p.id}
            className="rounded-2xl p-5 transition-all duration-200"
            style={card}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(107,50,214,0.28)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}, ${AVATAR_COLORS[(idx + 1) % AVATAR_COLORS.length]})` }}
                >
                  {p.nombre.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "rgba(237,232,252,0.88)" }}>{p.nombre}</p>
                  <p className="text-xs" style={{ color: "rgba(237,232,252,0.38)" }}>{p.rol === "admin" ? "Admin" : "Cajero"}</p>
                </div>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full"
                style={p.activo
                  ? { background: "rgba(16,185,129,0.1)", color: "#34D399" }
                  : { background: "rgba(100,116,139,0.1)", color: "#94A3B8" }
                }
              >
                {p.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div className="space-y-2 mb-4">
              {[
                { label: "Sede", value: p.sede ?? "Sin sede asignada" },
                { label: "Canjes procesados", value: p.canjes },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span style={{ color: "rgba(237,232,252,0.3)" }}>{item.label}</span>
                  <span className="font-medium" style={{ color: "rgba(237,232,252,0.65)" }}>{item.value}</span>
                </div>
              ))}
              <div className="flex justify-between text-xs items-center">
                <span style={{ color: "rgba(237,232,252,0.3)" }}>Presencia</span>
                <span className="flex items-center gap-1.5 font-medium" style={{ color: p.enLinea ? "#34D399" : "rgba(237,232,252,0.4)" }}>
                  <span
                    className="inline-block rounded-full"
                    style={{ width: 6, height: 6, background: p.enLinea ? "#34D399" : "rgba(237,232,252,0.3)" }}
                  />
                  {p.enLinea ? "En línea" : "Fuera de línea"}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleResetPassword(p)}
              disabled={resettingId === p.id}
              className="w-full text-xs px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(237,232,252,0.6)" }}
            >
              {resettingId === p.id ? "Restableciendo..." : "Restablecer contraseña"}
            </button>
          </div>
        ))}
        {usuarios.length === 0 && (
          <div style={{ ...card, padding: "2rem" }} className="col-span-full">
            <p className="text-sm text-center" style={{ color: "rgba(237,232,252,0.3)" }}>No hay personal registrado.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AgregarMiembroModal
          sedes={sedes}
          onCancel={() => setShowAddModal(false)}
          onCreated={(nombre, temporal) => {
            setShowAddModal(false);
            setTempPassword({ nombre, temporal });
            reload();
          }}
        />
      )}

      {tempPassword && (
        <TemporalPasswordBanner
          nombre={tempPassword.nombre}
          temporal={tempPassword.temporal}
          onClose={() => setTempPassword(null)}
        />
      )}
    </div>
  );
}
