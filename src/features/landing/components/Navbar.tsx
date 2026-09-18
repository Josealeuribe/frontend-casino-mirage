import { useState } from "react";
import { Menu } from "lucide-react";
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
      className="fixed top-0 left-0 right-0 z-40 grid grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 md:px-10 h-[var(--nav-h)]"
      style={{
        // El intento de tono calido (bronce/ambar) no combinaba con el
        // resto del aplicativo -- de vuelta al tono original.
        background: "rgba(8,7,24,0.92)",
        borderBottom: "1px solid rgba(107,50,214,0.18)",
        backdropFilter: "blur(14px)",
      }}
    >
      {/* Trazado decorativo de ondas -- azul + destellos morados, en dos
          franjas finas (arriba y abajo) que NUNCA tocan el centro de la
          barra, que es donde vive el logo, los enlaces y los botones. Nada
          de contenido cae en el 12%-88% vertical, asi que las ondas no
          quedan ni detras ni delante de ninguna opcion de navegacion --estan
          en una zona que el contenido nunca ocupa, sin depender de z-index.
          Tampoco cruzan de borde a borde: cada linea nace de un degradado
          (opacity 0 -> color -> 0) que la desvanece en ambas puntas, como en
          la referencia.
          `overflow-hidden` va en ESTE div propio y no en el <nav>: el menu
          movil cuelga por debajo del alto de la barra y un overflow en el
          nav se lo cortaria tambien. */}
      <div className="absolute inset-0 overflow-hidden -z-10" aria-hidden="true">
        <svg className="h-full w-full" viewBox="0 0 1600 100" preserveAspectRatio="none" fill="none">
          <defs>
            {/* gradientUnits por defecto es objectBoundingBox: x1=0/x2=1 recorre
                el propio largo de cada trazo, asi que cualquier curva que lo
                use se desvanece en sus dos puntas sin tener que calcular nada
                a mano por linea. */}
            <linearGradient id="navOndaAzul" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00C4D8" stopOpacity="0" />
              <stop offset="18%" stopColor="#00C4D8" stopOpacity="0.55" />
              <stop offset="65%" stopColor="#00C4D8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00C4D8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="navOndaMorada" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8B5CE8" stopOpacity="0" />
              <stop offset="22%" stopColor="#8B5CE8" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#8B5CE8" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#8B5CE8" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Franja superior: oscilacion RAPIDA y marcada (periodo corto,
              amplitud grande para el poco alto que hay) -- una curva suave de
              periodo largo, al aplastarla en una franja tan delgada, se ve
              casi recta. Con vueltas frecuentes se nota el curveo real aunque
              la franja sea angosta. Confinada a y aprox -10/26 (del 0-100 del
              viewBox), muy por encima del centro vertical donde esta el
              contenido -- nunca toca el logo ni los enlaces. */}
          <g>
            <path d="M-100,8 C0,-8 100,26 200,6 C300,-10 400,24 500,4 C600,-10 700,24 800,4 C900,-10 1000,24 1100,4 C1200,-10 1300,24 1400,4 C1480,-6 1520,18 1550,6" stroke="url(#navOndaAzul)" strokeWidth="1.4" />
            <path d="M-100,14 C20,0 120,30 220,12 C320,-4 420,28 520,10 C620,-4 720,28 820,10 C920,-4 1020,28 1120,10 C1220,-4 1320,28 1420,10 C1490,2 1520,22 1550,12" stroke="url(#navOndaAzul)" strokeWidth="1" />
            <path d="M-100,2 C-20,-14 80,18 180,-2 C280,-16 380,16 480,-4 C580,-16 680,16 780,-4 C880,-16 980,16 1080,-4 C1180,-16 1280,16 1380,-4 C1460,-12 1500,10 1550,-2" stroke="url(#navOndaMorada)" strokeWidth="1.2" />
            <path d="M-100,19 C40,6 140,34 240,17 C340,4 440,32 540,15 C640,4 740,32 840,15 C940,4 1040,32 1140,15 C1240,4 1340,32 1440,15 C1500,10 1530,26 1550,17" stroke="url(#navOndaAzul)" strokeWidth="0.8" />
          </g>

          {/* Franja inferior: mismas curvas, invertidas en vertical
              (y' = 100-y) para que ondulen hacia abajo en espejo, confinadas
              a y aprox 74/110 -- tampoco toca el centro. */}
          <g>
            <path d="M-100,92 C0,108 100,74 200,94 C300,110 400,76 500,96 C600,110 700,76 800,96 C900,110 1000,76 1100,96 C1200,110 1300,76 1400,96 C1480,106 1520,82 1550,94" stroke="url(#navOndaAzul)" strokeWidth="1.4" />
            <path d="M-100,86 C20,100 120,70 220,88 C320,104 420,72 520,90 C620,104 720,72 820,90 C920,104 1020,72 1120,90 C1220,104 1320,72 1420,90 C1490,98 1520,78 1550,88" stroke="url(#navOndaAzul)" strokeWidth="1" />
            <path d="M-100,98 C-20,114 80,82 180,102 C280,116 380,84 480,104 C580,116 680,84 780,104 C880,116 980,84 1080,104 C1180,116 1280,84 1380,104 C1460,112 1500,90 1550,102" stroke="url(#navOndaMorada)" strokeWidth="1.2" />
            <path d="M-100,81 C40,94 140,66 240,83 C340,96 440,68 540,85 C640,96 740,68 840,85 C940,96 1040,68 1140,85 C1240,96 1340,68 1440,85 C1500,90 1530,74 1550,83" stroke="url(#navOndaAzul)" strokeWidth="0.8" />
          </g>
        </svg>
      </div>

      {/* --- Movil verdadero (debajo de sm, ~640px): icono y nombre por
          separado, no como un bloque conjunto --------------------------- */}

      {/* Icono a la izquierda. col-start-1 + justify-self-start es la misma
          columna que usa el logo de escritorio (ver mas abajo) -- como uno
          se oculta cuando el otro aparece, nunca compiten por el espacio. */}
      <Link to="/" className="col-start-1 flex items-center justify-self-start sm:hidden">
        <img src={logoMirage} alt="Centro Club Mirage" className="h-8 w-auto object-contain" />
      </Link>

      {/* Nombre centrado en TODA la barra. No hace falta position:absolute
          (que en el intento anterior traia su propio problema de ancho):
          col-start-2 es la columna "auto" entre dos columnas 1fr iguales,
          el mismo mecanismo que ya centra los enlaces de escritorio mas
          abajo. Con dos columnas iguales a los lados, lo que caiga en el
          medio queda centrado en el ancho completo automaticamente. */}
      <Link to="/" className="col-start-2 flex justify-self-center sm:hidden">
        <span
          className="font-bold text-sm uppercase whitespace-nowrap"
          style={{ color: "#D4A827", letterSpacing: "0.03em", fontFamily: "Roboto" }}
        >
          Centro Club{" "}
          <span className="text-xs" style={{ color: "#00C4D8" }}>
            Mirage
          </span>
        </span>
      </Link>

      {/* --- Tablet y escritorio (a partir de sm): icono y nombre juntos,
          alineados a la izquierda -- igual que se dejo la vez anterior --- */}
      <Link to="/" className="col-start-1 hidden items-center gap-2.5 justify-self-start sm:flex">
        <img
          src={logoMirage}
          alt="Centro Club Mirage"
          className="h-10 w-auto object-contain md:h-11 2xl:h-12"
        />
        {/* Oculto solo en xl (1280-1535): ahi conviven los seis enlaces y
            los dos botones y el texto ya no cabe, se monta sobre "Inicio".
            La imagen del logo ya lleva el nombre, asi que en esa franja no
            se pierde informacion. Interletrado apretado (0.03-0.04em):
            pedido explicito de que el titulo quede "mas junto". "Mirage" va
            un escalon de tamano por debajo de "Centro Club", no al mismo
            tamano. */}
        <span
          className="block xl:hidden 2xl:block font-bold text-base 2xl:text-xl uppercase whitespace-nowrap"
          style={{ color: "#D4A827", letterSpacing: "0.04em", fontFamily: "Roboto" }}
        >
          Centro Club{" "}
          <span className="text-xs 2xl:text-sm" style={{ color: "#00C4D8" }}>
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
              onClick={() => navigate(user.role === "admin" ? "/admin" : user.role === "cajero" ? "/cajero" : "/cuenta")}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200"
              style={{
                border: "1px solid rgba(107,50,214,0.5)",
                color: "#8B5CE8",
                background: "rgba(107,50,214,0.1)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(107,50,214,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(107,50,214,0.1)"; }}
            >
              {user.role === "admin" ? "Panel admin" : user.role === "cajero" ? "Panel cajero" : "Mi cuenta"}
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
                border: "1px solid rgba(212,168,39,0.5)",
                color: "rgba(237,232,252,0.75)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#EDE8FC";
                e.currentTarget.style.borderColor = "#D4A827";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(237,232,252,0.75)";
                e.currentTarget.style.borderColor = "rgba(212,168,39,0.5)";
              }}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate("/registro")}
              className="px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200"
              style={{
                background: "#00C4D8",
                color: "#04141A",
                boxShadow: "0 4px 20px rgba(0,196,216,0.35)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#33D2E3";
                e.currentTarget.style.boxShadow = "0 6px 28px rgba(0,196,216,0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#00C4D8";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,196,216,0.35)";
              }}
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
          <Menu size={24} strokeWidth={1.7} />
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
                  border: "1px solid rgba(212,168,39,0.5)",
                  color: "rgba(237,232,252,0.75)",
                  background: "transparent",
                }}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => { navigate("/registro"); setMenuOpen(false); }}
                className="flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200"
                style={{
                  background: "#00C4D8",
                  color: "#04141A",
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
