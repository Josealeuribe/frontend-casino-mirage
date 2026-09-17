import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/features/auth/AuthContext";
import { NAV_LINKS, esVistaActiva } from "../navigation";
import logoMirage from "@/imports/logo-mirage.png";

const pillBase =
  "relative block px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200";
// Antes la opcion activa llevaba fondo y texto cyan (un "difuminado" que
// tenia el texto entero). Ahora solo se distingue por el texto en blanco
// pleno (vs el 60% del resto) mas la barrita dorada debajo -- sin ningun
// relleno de color detras.
const pillActive = "text-text";
const pillIdle = "text-text/60 hover:text-text hover:bg-white/[0.06]";

export default function Navbar() {
  const { user, logout, openLogin } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      // Rejilla 1fr / auto / 1fr en vez de justify-between: con flex, el grupo
      // del medio solo queda centrado si los laterales miden igual, y aqui el
      // logo es mucho mas ancho que los botones, asi que los enlaces se iban a
      // la derecha. Con 1fr a cada lado el bloque central cae en el centro
      // exacto del viewport.
      //
      // Cada bloque fija su columna con col-start: un hijo con display:none no
      // ocupa celda en un grid, y al ocultarse los enlaces en movil los
      // botones se corrian al centro.
      className="fixed top-0 left-0 right-0 z-40 grid grid-cols-[1fr_auto_1fr] items-center px-6 md:px-10 h-[var(--nav-h)]"
      style={{
        background: "rgba(8,7,24,0.92)",
        borderBottom: "1px solid rgba(107,50,214,0.18)",
        backdropFilter: "blur(14px)",
      }}
    >
      {/* Logo -- lleva al punto de entrada, que es la ruleta. */}
      <Link to="/" className="col-start-1 flex items-center gap-3 justify-self-start">
        <img
          src={logoMirage}
          alt="Centro Club Mirage"
          className="h-14 md:h-16 w-auto object-contain"
        />
        {/* Visible siempre, incluido movil -- antes tenia "hidden sm:block" y
            desaparecia por completo debajo de 640px, dejando el navbar con
            solo el logo y sin nombre. Oculto solo en xl (1280-1535): ahi
            conviven los seis enlaces y los dos botones y el texto ya no
            cabe, se monta sobre "Inicio". La imagen del logo ya lleva el
            nombre, asi que en esa franja no se pierde informacion. */}
        {/* Interletrado bajado de 0.18em a 0.05em: pedido explicito de que el
            titulo quede "mas junto". "Mirage" va un escalon de tamano por
            debajo de "Centro Club", no al mismo tamano. En movil ambos bajan
            un poco mas, para que quepan junto al logo sin desbordar. */}
        <span
          className="block xl:hidden 2xl:block font-bold text-[11px] sm:text-base 2xl:text-xl uppercase whitespace-nowrap"
          style={{ color: "#D4A827", letterSpacing: "0.04em", fontFamily: "Roboto" }}
        >
          Centro Club{" "}
          <span className="text-[10px] sm:text-xs 2xl:text-sm" style={{ color: "#00C4D8" }}>
            Mirage
          </span>
        </span>
      </Link>

      {/* Enlaces -- a partir de xl. Por debajo no caben seis enlaces mas el
          logo mas dos botones sin descentrarse, asi que manda el menu movil. */}
      <ul className="col-start-2 hidden xl:flex items-center gap-1 justify-self-center">
        {NAV_LINKS.map((link) => {
          const isActive = esVistaActiva(link, pathname);
          return (
            <li key={link.to}>
              <Link to={link.to} className={`${pillBase} ${isActive ? pillActive : pillIdle}`}>
                {link.label}
                {isActive && (
                  <span
                    className="absolute left-4 right-4 bottom-1 h-0.5 rounded-full"
                    style={{ background: "#D4A827" }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Acciones de cuenta */}
      <div className="col-start-3 flex items-center gap-2.5 justify-self-end">
        {user ? (
          <>
            <button
              onClick={() => navigate("/admin")}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200"
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
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200"
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
          // Ocultos por debajo de md: en un movil los dos botones mas el logo
          // no caben en la barra. Ahi viven dentro del menu desplegable.
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={openLogin}
              className="px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(237,232,252,0.75)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#EDE8FC";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(237,232,252,0.75)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
              }}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={openLogin}
              className="px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #6B32D6 0%, #1A5ED8 100%)",
                color: "#fff",
                boxShadow: "0 4px 20px rgba(107,50,214,0.35)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 28px rgba(107,50,214,0.55)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(107,50,214,0.35)"; }}
            >
              Registrarse
            </button>
          </div>
        )}

        <button
          className="xl:hidden p-1.5"
          style={{ color: "rgba(237,232,252,0.55)" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div
          className="absolute top-[var(--nav-h)] left-0 right-0 py-3 xl:hidden"
          style={{ background: "rgba(8,7,24,0.98)", borderBottom: "1px solid rgba(107,50,214,0.15)" }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = esVistaActiva(link, pathname);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block w-full px-6 py-3.5 text-sm transition-colors border-l-[3px] ${
                  isActive
                    ? "border-gold text-text"
                    : "border-transparent text-text/60 hover:text-text hover:bg-white/[0.06]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Los botones de cuenta solo aparecen aqui cuando no caben arriba. */}
          {!user && (
            <div className="flex gap-2.5 px-6 pt-3 md:hidden">
              <button
                onClick={() => { openLogin(); setMenuOpen(false); }}
                className="flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200"
                style={{
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "rgba(237,232,252,0.75)",
                  background: "transparent",
                }}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => { openLogin(); setMenuOpen(false); }}
                className="flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #6B32D6 0%, #1A5ED8 100%)",
                  color: "#fff",
                }}
              >
                Registrarse
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
