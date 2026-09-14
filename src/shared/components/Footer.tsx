import { useAuth } from "@/features/auth/AuthContext";
import { SEDES, comoLlegarUrl, type Sede } from "@/shared/data/sedes";
import { scrollToSection } from "@/shared/utils/scroll";
import logoMirage from "@/imports/logo-mirage.png";
import logoSupersalud from "@/imports/logo-vigilado-supersalud.png";
import logoColjuegos from "@/imports/logo-autoriza-coljuegos.webp";
import imagenMayores18 from "@/imports/image+18.png";
import bandaCondiciones from "@/imports/image-condiciones-coljuegos.png";

const NAV_LINKS = [
  { label: "Inicio", target: "inicio" },
  { label: "Gira y Gana", target: "gira-y-gana" },
  { label: "Premios", target: "premios" },
  { label: "Cómo Funciona", target: "como-funciona" },
  { label: "Sedes", target: "sedes" },
  { label: "Preguntas Frecuentes", target: "faq" },
];

const LEGAL_LINKS = [
  "Términos y Condiciones",
  "Política de Privacidad",
  "Tratamiento de Datos",
  "Juego Responsable",
  "Condiciones Promoción",
];

const tituloColumna = "text-xs font-bold tracking-[0.2em] uppercase mb-4";

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

function SedeCard({ sede }: { sede: Sede }) {
  return (
    <div
      className="flex flex-col gap-3 rounded-2xl p-5 transition-all duration-300"
      style={{ background: "rgba(14,11,40,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,168,39,0.3)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
          style={{ background: "rgba(212,168,39,0.1)", color: "#D4A827" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5c-2.5 0-4.5 2-4.5 4.5 0 3.2 4.5 8.5 4.5 8.5s4.5-5.3 4.5-8.5c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            <circle cx="8" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </span>
        <div className="min-w-0">
          <h5 className="text-sm font-bold leading-snug text-white">{sede.nombre}</h5>
          <p className="mt-1 text-sm" style={{ color: "rgba(237,232,252,0.5)" }}>
            {sede.direccion}
          </p>
          <p className="text-xs" style={{ color: "rgba(237,232,252,0.3)" }}>
            {sede.ciudad}, Colombia
          </p>
        </div>
      </div>

      <a
        href={comoLlegarUrl(sede)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all duration-200"
        style={{
          background: "rgba(212,168,39,0.1)",
          border: "1px solid rgba(212,168,39,0.25)",
          color: "#D4A827",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,168,39,0.2)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(212,168,39,0.1)"; }}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M11.5 1.5L7.5 11.5 6 7 1.5 5.5 11.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
        Cómo llegar
      </a>
    </div>
  );
}

export default function Footer() {
  const { openLogin } = useAuth();

  return (
    <footer
      id="sedes"
      className="w-full px-6 py-14"
      style={{ background: "#0A0820", borderTop: "1px solid rgba(212,168,39,0.18)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-10 md:grid-cols-4">
          {/* Marca y sellos */}
          <div className="md:col-span-2">
            <img src={logoMirage} alt="Centro Club Mirage" className="mb-5 h-16 w-auto object-contain" />

            <p className="mb-6 max-w-sm text-sm leading-relaxed" style={{ color: "rgba(237,232,252,0.45)" }}>
              Entretenimiento premium y beneficios exclusivos para nuestros socios en Arauca.
              Diversión responsable.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <SelloRegulador src={logoColjuegos} alt="Autorizado por Coljuegos" />
              <SelloRegulador src={logoSupersalud} alt="Vigilado Supersalud" />
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h4 className={tituloColumna} style={{ color: "#D4A827" }}>
              Navegación
            </h4>
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.target)}
                className="mb-2.5 block text-left text-sm transition-colors"
                style={{ color: "rgba(237,232,252,0.45)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#D4A827"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.45)"; }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={openLogin}
              className="mb-2.5 block text-left text-sm transition-colors"
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
            {LEGAL_LINKS.map((label) => (
              <span
                key={label}
                className="mb-2.5 block text-sm"
                style={{ color: "rgba(237,232,252,0.45)" }}
              >
                {label}
              </span>
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

        {/* Ubicación */}
        <div className="mb-12 border-t pt-10" style={{ borderColor: "rgba(212,168,39,0.12)" }}>
          <h4 className={tituloColumna} style={{ color: "#D4A827" }}>
            Ubicación
          </h4>
          <p className="mb-6 max-w-lg text-sm" style={{ color: "rgba(237,232,252,0.45)" }}>
            Tu bono se redime presencialmente. Encuéntranos en nuestras dos sedes de Arauca.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {SEDES.map((sede) => (
              <SedeCard key={sede.clave} sede={sede} />
            ))}
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
