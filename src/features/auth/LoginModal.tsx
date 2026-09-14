import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import logoMirage from "@/imports/logo-mirage.png";

export default function LoginModal() {
  const { login, closeLogin } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(username, password);
    setLoading(false);
    if (ok) {
      navigate("/admin");
    } else {
      setError("Credenciales incorrectas. Intenta con admin / admin123");
    }
  };

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(4,3,14,0.88)", backdropFilter: "blur(10px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) closeLogin(); }}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl p-8"
        style={{
          background: "linear-gradient(145deg, #120E30 0%, #1A1445 100%)",
          border: "1px solid rgba(107,50,214,0.28)",
          boxShadow: "0 32px 80px rgba(4,3,14,0.8), 0 0 60px rgba(107,50,214,0.08)",
        }}
      >
        <button
          onClick={closeLogin}
          className="absolute top-4 right-4 text-lg leading-none transition-colors"
          style={{ color: "rgba(237,232,252,0.3)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.7)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.3)"; }}
        >
          ✕
        </button>

        <div className="flex flex-col items-center mb-8">
          <img src={logoMirage} alt="Centro Club Mirage" className="h-16 w-auto mb-4 object-contain" />
          <h2 className="text-xl font-bold text-white">Acceso Admin</h2>
          <p className="text-xs mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.4)" }}>
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "rgba(107,50,214,0.55)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(237,232,252,0.4)" }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "rgba(107,50,214,0.55)"; }}
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
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 mt-1"
            style={{
              background: loading
                ? "rgba(107,50,214,0.4)"
                : "linear-gradient(135deg, #6B32D6 0%, #1A5ED8 100%)",
              color: "#fff",
              letterSpacing: "0.04em",
              boxShadow: loading ? "none" : "0 6px 24px rgba(107,50,214,0.35)",
            }}
          >
            {loading ? "Verificando..." : "Ingresar al Panel"}
          </button>
        </form>

        <p className="text-center text-xs mt-5" style={{ color: "rgba(237,232,252,0.22)" }}>
          Demo: <span style={{ color: "rgba(237,232,252,0.4)" }}>admin / admin123</span>
        </p>
      </div>
    </div>
  );
}
