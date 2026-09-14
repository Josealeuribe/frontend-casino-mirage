import { useAuth } from "@/features/auth/AuthContext";

const card: React.CSSProperties = {
  background: "#0E0B28",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "0.875rem",
  padding: "1.5rem",
};

export default function MiCuenta() {
  const { user } = useAuth();

  return (
    <div className="space-y-5 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Mi Cuenta</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>
          Configuración de perfil de administrador
        </p>
      </div>

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
            {user?.name?.[0] ?? "A"}
          </div>
          <div>
            <p className="text-lg font-bold text-white">{user?.name ?? "Admin"}</p>
            <p className="text-sm mt-0.5" style={{ color: "rgba(237,232,252,0.4)" }}>
              Administrador · Centro Club Mirage
            </p>
            <span
              className="text-xs px-2.5 py-1 rounded-full inline-block mt-2"
              style={{ background: "rgba(107,50,214,0.12)", color: "#C4B5FD", border: "1px solid rgba(107,50,214,0.22)" }}
            >
              Acceso completo
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: "Nombre",       value: user?.name ?? "Admin",         type: "text" },
            { label: "Usuario",      value: "admin",                        type: "text",     readOnly: true },
            { label: "Email",        value: "admin@miragecasino.co",        type: "email" },
            { label: "Contraseña",   value: "••••••••",                    type: "password" },
          ].map((field, i) => (
            <div key={i}>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                style={{ color: "rgba(237,232,252,0.38)" }}
              >
                {field.label}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type={field.type}
                  defaultValue={field.value}
                  readOnly={field.readOnly}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(237,232,252,0.7)",
                  }}
                />
                {(field.label === "Email" || field.label === "Contraseña") && (
                  <button
                    className="text-xs px-3 py-2 rounded-xl transition-colors"
                    style={{ background: "rgba(107,50,214,0.1)", border: "1px solid rgba(107,50,214,0.2)", color: "#C4B5FD" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(107,50,214,0.2)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(107,50,214,0.1)"; }}
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg,#6B32D6,#1A5ED8)", boxShadow: "0 4px 16px rgba(107,50,214,0.28)" }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 22px rgba(107,50,214,0.45)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(107,50,214,0.28)"; }}
        >
          Guardar cambios
        </button>
      </div>

      {/* Danger zone */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)" }}
      >
        <h3 className="text-sm font-medium mb-1" style={{ color: "rgba(237,232,252,0.65)" }}>Zona de riesgo</h3>
        <p className="text-xs mb-4" style={{ color: "rgba(237,232,252,0.3)" }}>
          Las siguientes acciones son permanentes e irreversibles.
        </p>
        <button
          className="text-xs px-4 py-2 rounded-xl transition-colors"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#F87171" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.14)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
        >
          Eliminar cuenta
        </button>
      </div>
    </div>
  );
}
