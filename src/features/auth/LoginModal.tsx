import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { X } from "lucide-react";
import { useAuth } from "./AuthContext";
import VolverInicio from "@/shared/components/VolverInicio";
import logoMirage from "@/imports/logo-mirage.png";

export default function LoginModal() {
  const { login, closeLogin } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showOlvide, setShowOlvide] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(username, password, remember);
    setLoading(false);
    if (result.ok) {
      // El rol decide a donde va cada quien: el admin y el cajero tienen
      // paneles propios, y un cliente no tiene panel -- vuelve al inicio,
      // donde ya puede ver el estado de su bono.
      if (result.role === "admin") navigate("/admin");
      else if (result.role === "cajero") navigate("/cajero");
      else navigate("/cuenta");
    } else {
      setError(result.error ?? "No se pudo iniciar sesión.");
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 px-4"
      style={{ backgroundColor: "rgba(4,3,14,0.88)", backdropFilter: "blur(10px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) closeLogin(); }}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl p-8"
        style={{
          background: "linear-gradient(160deg, #130E2E 0%, #0E0B28 100%)",
          border: "1px solid rgba(212,168,39,0.3)",
          boxShadow: "0 40px 100px rgba(4,3,16,0.8), 0 0 80px rgba(212,168,39,0.08)",
        }}
      >
        <button
          onClick={closeLogin}
          aria-label="Cerrar"
          className="absolute top-5 right-5 transition-colors duration-200"
          style={{ color: "rgba(237,232,252,0.3)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#FCA5A5"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.3)"; }}
        >
          <X size={18} strokeWidth={2} />
        </button>

        <div className="flex flex-col items-center text-center mb-7">
          <img src={logoMirage} alt="Centro Club Mirage" className="h-16 w-auto mb-4 object-contain" />
          <span className="text-xs font-bold tracking-[0.25em] uppercase mb-2" style={{ color: "#D4A827" }}>
            Centro Club Mirage
          </span>
          <h2 className="text-2xl font-black text-white" style={{ letterSpacing: "-0.01em" }}>
            Bienvenido nuevamente
          </h2>
          <p className="text-sm mt-1.5" style={{ color: "rgba(237,232,252,0.45)" }}>
            Accede a tu cuenta para ver tus beneficios
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "rgba(237,232,252,0.75)" }}>
              Correo o documento
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="correo@ejemplo.com"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "rgba(212,168,39,0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "rgba(237,232,252,0.75)" }}>
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                style={{ ...inputStyle, paddingRight: "3.25rem" }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(212,168,39,0.5)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold transition-colors duration-200"
                style={{ color: "rgba(212,168,39,0.75)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#ECC84C"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,168,39,0.75)"; }}
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="flex items-center gap-2 text-xs cursor-pointer select-none" style={{ color: "rgba(237,232,252,0.5)" }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 rounded"
                style={{ accentColor: "#6B32D6" }}
              />
              Recordarme
            </label>
            <button
              type="button"
              onClick={() => setShowOlvide((v) => !v)}
              className="text-xs font-semibold underline underline-offset-2 transition-colors duration-200"
              style={{ color: "#D4A827" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#ECC84C"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#D4A827"; }}
            >
              Olvidé mi contraseña
            </button>
          </div>

          {showOlvide && (
            <p className="text-xs rounded-lg px-3 py-2.5" style={{ background: "rgba(107,50,214,0.08)", color: "rgba(237,232,252,0.55)", border: "1px solid rgba(107,50,214,0.18)" }}>
              Por ahora la recuperación no es automática: pídele a un administrador de tu sede que te restablezca la contraseña.
            </p>
          )}

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
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 mt-1 disabled:cursor-not-allowed"
            style={{
              background: loading
                ? "rgba(107,50,214,0.4)"
                : "linear-gradient(135deg, #6B32D6 0%, #1A5ED8 100%)",
              color: "#fff",
              letterSpacing: "0.04em",
              boxShadow: loading ? "none" : "0 6px 24px rgba(107,50,214,0.35)",
            }}
            onMouseEnter={(e) => {
              if (loading) return;
              e.currentTarget.style.background = "linear-gradient(135deg, #7C43E8 0%, #2E6FEF 100%)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(107,50,214,0.55)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              if (loading) return;
              e.currentTarget.style.background = "linear-gradient(135deg, #6B32D6 0%, #1A5ED8 100%)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(107,50,214,0.35)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {loading ? "Verificando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-6 pt-5 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-xs" style={{ color: "rgba(237,232,252,0.45)" }}>
            ¿Aún no tienes una cuenta?{" "}
            <Link
              to="/jugar"
              onClick={closeLogin}
              className="font-bold transition-colors duration-200"
              style={{ color: "#D4A827" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#ECC84C"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#D4A827"; }}
            >
              Gira y regístrate
            </Link>
          </p>
        </div>
      </div>

      {/* Fuera de la tarjeta, como en la referencia: la "X" cierra sin
          moverse de donde ya se estaba; esto en cambio navega de vuelta al
          inicio del sitio. Mismo componente que usan las 5 paginas legales
          y las vistas de Premios/Como Funciona/Sedes/FAQ. */}
      <VolverInicio variante="enlace" onNavigate={closeLogin} />
    </div>
  );
}
