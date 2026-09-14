import { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { useNavigate } from "react-router";
import logoMirage from "@/imports/logo-mirage.png";

const NAV_LINKS = [
  { label: "Inicio",        target: "inicio" },
  { label: "Gira y Gana",   target: "gira-y-gana" },
  { label: "Premios",       target: "premios" },
  { label: "Cómo Funciona", target: "como-funciona" },
  { label: "FAQ",           target: "faq" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar() {
  const { user, logout, openLogin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-10 h-16"
      style={{
        background: "rgba(8,7,24,0.92)",
        borderBottom: "1px solid rgba(107,50,214,0.18)",
        backdropFilter: "blur(14px)",
      }}
    >
      {/* Logo */}
      <button
        className="flex items-center gap-3"
        onClick={() => scrollTo("inicio")}
      >
        <img src={logoMirage} alt="Mirage Casino" className="h-10 w-auto object-contain" />
        <span
          className="hidden sm:block font-bold text-base tracking-widest uppercase"
          style={{ color: "#D4A827", letterSpacing: "0.18em", fontFamily: "Roboto" }}
        >
          Mirage <span style={{ color: "#00C4D8" }}>Casino</span>
        </span>
      </button>

      {/* Nav links */}
      <ul className="hidden lg:flex items-center gap-7">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <button
              onClick={() => scrollTo(link.target)}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "rgba(237,232,252,0.6)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#EDE8FC"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.6)"; }}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        {user ? (
          <>
            <button
              onClick={() => navigate("/admin")}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                border: "1px solid rgba(107,50,214,0.5)",
                color: "#8B5CE8",
                background: "rgba(107,50,214,0.1)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(107,50,214,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(107,50,214,0.1)"; }}
            >
              Panel admin
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(237,232,252,0.55)",
                background: "transparent",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#EDE8FC"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.55)"; }}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <button
            onClick={openLogin}
            className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #6B32D6 0%, #1A5ED8 100%)",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(107,50,214,0.35)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 28px rgba(107,50,214,0.55)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(107,50,214,0.35)"; }}
          >
            Iniciar Sesión
          </button>
        )}

        <button
          className="lg:hidden p-1.5"
          style={{ color: "rgba(237,232,252,0.55)" }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="absolute top-16 left-0 right-0 py-3 lg:hidden"
          style={{ background: "rgba(8,7,24,0.98)", borderBottom: "1px solid rgba(107,50,214,0.15)" }}
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              className="block w-full text-left px-6 py-3 text-sm transition-colors"
              style={{ color: "rgba(237,232,252,0.6)" }}
              onClick={() => { scrollTo(link.target); setMenuOpen(false); }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#EDE8FC"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.6)"; }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
