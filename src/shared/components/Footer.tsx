import { Link, NavLink, useLocation } from "react-router";
import { useAuth } from "@/features/auth/AuthContext";
import { NAV_LINKS, esVistaActiva } from "@/features/landing/navigation";
import logoMirage from "@/imports/logo-mirage.png";
import logoSupersalud from "@/imports/logo-vigilado-supersalud.png";
import logoColjuegos from "@/imports/logo-autoriza-coljuegos.webp";
import imagenMayores18 from "@/imports/image+18.png";
import bandaCondiciones from "@/imports/image-condiciones-coljuegos.png";

const LEGAL_LINKS = [
  { label: "Términos y Condiciones", to: "/legal/terminos-y-condiciones" },
  { label: "Política de Privacidad", to: "/legal/politica-de-privacidad" },
  { label: "Tratamiento de Datos", to: "/legal/tratamiento-de-datos" },
  { label: "Juego Responsable", to: "/legal/juego-responsable" },
  { label: "Condiciones Promoción", to: "/legal/condiciones-promocion" },
];

const tituloColumna = "text-xs font-bold tracking-[0.2em] uppercase mb-4";
const enlaceFooter = "mb-2.5 block text-left text-sm transition-colors";

/** Recuadro claro para los sellos de las entidades reguladoras: vienen sobre
 *  fondo blanco y se pierden contra el morado del footer. */
function SelloRegulador({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="flex h-16 w-36 items-center justify-center rounded-xl p-2.5 transition-all duration-300"
      style={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(212,168,39,0.18)" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,168,39,0.45)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(212,168,39,0.18)"; }}
    >
      <img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
    </div>
  );
}

export default function Footer() {
  const { openLogin } = useAuth();
  const { pathname } = useLocation();

  return (
    // Unico bloque de la landing con fondo propio: aqui el recuadro sobre la
    // imagen si es deseado, marca el cierre de la pagina.
    <footer
      className="w-full px-6 py-14"
      style={{ background: "rgba(10,8,32,0.7)", borderTop: "1px solid rgba(212,168,39,0.18)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-10 md:grid-cols-4">
          {/* Marca y sellos */}
          <div className="md:col-span-2">
            <div className="mb-5 flex items-center gap-4">
              <img src={logoMirage} alt="Centro Club Mirage" className="h-16 w-auto object-contain" />

              <a
                href="https://www.instagram.com/casinomirage.a/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Instagram"
                title="Síguenos en Instagram"
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300"
                style={{
                  background: "rgba(212,168,39,0.1)",
                  border: "1px solid rgba(212,168,39,0.25)",
                  color: "#D4A827",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,168,39,0.22)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(212,168,39,0.1)"; }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2.5" y="2.5" width="15" height="15" rx="4.5" stroke="currentColor" strokeWidth="1.4" />
                  <circle cx="10" cy="10" r="3.8" stroke="currentColor" strokeWidth="1.4" />
                  <circle cx="14.6" cy="5.4" r="1" fill="currentColor" />
                </svg>
              </a>
            </div>

            <p className="mb-6 max-w-sm text-sm leading-relaxed" style={{ color: "rgba(237,232,252,0.45)" }}>
              Entretenimiento premium y beneficios exclusivos para nuestros socios en Arauca.
              Diversión responsable.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <SelloRegulador src={logoColjuegos} alt="Autorizado por Coljuegos" />
              <SelloRegulador src={logoSupersalud} alt="Vigilado Supersalud" />
            </div>
          </div>

          {/* Navegación -- las mismas vistas del navbar, leidas de la misma
              lista para que no se desincronicen. */}
          <div>
            <h4 className={tituloColumna} style={{ color: "#D4A827" }}>
              Navegación
            </h4>
            {NAV_LINKS.map((link) => {
              // Misma logica que el Navbar: "Gira y Gana" tambien cuenta como
              // activo en "/jugar", la vista de la ruleta.
              const isActive = esVistaActiva(link, pathname);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={isActive ? `${enlaceFooter} font-bold text-cyan-light` : `${enlaceFooter} text-text/45 hover:text-cyan-light`}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={openLogin}
              className={enlaceFooter}
              style={{ color: "rgba(237,232,252,0.45)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#D4A827"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.45)"; }}
            >
              Iniciar Sesión
            </button>
          </div>

          {/* Legal */}
          <div>
            <h4 className={tituloColumna} style={{ color: "#D4A827" }}>
              Legal
            </h4>
            {LEGAL_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive ? `${enlaceFooter} font-bold text-cyan-light` : `${enlaceFooter} text-text/45 hover:text-cyan-light`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div
              className="mt-5 flex h-16 w-16 items-center justify-center rounded-xl p-2"
              style={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(212,168,39,0.18)" }}
            >
              <img
                src={imagenMayores18}
                alt="Solo para mayores de 18 años"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Banda de condiciones de la promoción */}
        <div className="mb-10 overflow-hidden rounded-xl bg-white p-2">
          <img
            src={bandaCondiciones}
            alt="Condiciones promocionales y entidades reguladoras"
            className="block h-auto w-full"
          />
        </div>

        <div
          className="flex flex-col items-center justify-between gap-3 border-t pt-6 md:flex-row"
          style={{ borderColor: "rgba(212,168,39,0.12)" }}
        >
          <p className="text-center text-xs md:text-left" style={{ color: "rgba(237,232,252,0.28)" }}>
            © 2026 Centro Club Mirage. Todos los derechos reservados.
          </p>
          <p
            className="flex items-center justify-center gap-1.5 text-center text-xs"
            style={{ color: "rgba(237,232,252,0.28)" }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="flex-shrink-0">
              <path d="M6.5 1L11 3v3.5c0 2.8-1.9 5.2-4.5 5.8C3.9 11.7 2 9.3 2 6.5V3l4.5-2z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
              <path d="M6.5 4.5v2.5M6.5 8.8v.1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
            Solo para mayores de 18 años · Juega con responsabilidad · Línea de ayuda: 01-8000-111-444
          </p>
        </div>
      </div>
    </footer>
  );
}
