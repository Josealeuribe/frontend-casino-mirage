import { Link } from "react-router";
import { RotateCw } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import PrizesSection from "../components/PrizesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import VolverInicio from "@/shared/components/VolverInicio";
import Roulette3D from "../roulette/components/Roulette3D";
import Marquee from "@/shared/components/Marquee";
import { MENSAJES_CINTA } from "../data/mensajesCinta";
import fichardoBono from "@/imports/fichardo-mirage-bono.png";

/** Los cuatro palos de la baraja, dibujados como trazos simples en vez de
 *  glifos de texto -- el sitio no usa emoji en ningun lado (dependen del
 *  sistema operativo y se ven distinto en cada uno), asi que estos tampoco
 *  debian ser una excepcion. */
const PALOS = {
  pica: (
    <>
      <g transform="translate(12,11) scale(1,-1) translate(-12,-11)">
        <path d="M12 19s-7-4.35-7-9.5A4.5 4.5 0 0112 7a4.5 4.5 0 019 2.5C21 14.65 12 19 12 19z" />
      </g>
      <path d="M9.5 15h5l1 6h-7z" />
    </>
  ),
  corazon: <path d="M12 21s-7-4.35-7-9.5A4.5 4.5 0 0112 9a4.5 4.5 0 019 2.5C21 16.65 12 21 12 21z" />,
  diamante: <path d="M12 3L20 13L12 23L4 13Z" />,
  trebol: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <circle cx="8.2" cy="13" r="3.6" />
      <circle cx="15.8" cy="13" r="3.6" />
      <path d="M10 15h4l1.2 6h-6.4z" />
    </>
  ),
} as const;

/** Destello con forma de carta de casino. Decorativo puro (aria-hidden), asi
 *  que la posicion se recibe como `style` en vez de props sueltas de top/left:
 *  unos van pegados a un borde con `right`, otros con `left`, y forzar una
 *  sola convencion habria complicado el llamado sin ganar nada. */
function CartaDestello({
  palo,
  color,
  style,
  size = 34,
  rotate = 0,
  delay = 0,
}: {
  palo: keyof typeof PALOS;
  color: string;
  style: React.CSSProperties;
  size?: number;
  rotate?: number;
  delay?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute animate-sparkle-float"
      style={{
        ...style,
        width: size,
        transform: `rotate(${rotate}deg)`,
        // Dos valores, uno por cada animacion de .animate-sparkle-float, en
        // el mismo orden que se declaran alli: destello primero, flotacion
        // despues.
        animationDelay: `${delay}s, ${delay * 0.6}s`,
        filter: `drop-shadow(0 0 10px ${color}99)`,
      }}
    >
      <svg width={size} height={size * 1.42} viewBox="0 0 24 34" fill="none">
        <rect
          x="1"
          y="1"
          width="22"
          height="32"
          rx="4"
          fill="rgba(14,11,40,0.6)"
          stroke={color}
          strokeWidth="1.4"
        />
        <g fill={color} transform="translate(0,4)">
          {PALOS[palo]}
        </g>
      </svg>
    </div>
  );
}

/** Punto de entrada del sitio ("/", "Gira y Gana" en el navbar).
 *
 *  Antes esta vista era la ruleta misma: se giraba directamente aqui. Ahora
 *  solo informa -- que hay en juego y como funciona -- y el boton "Gira y
 *  Gana" lleva a "/jugar", donde vive la ruleta interactiva y nada mas. Asi
 *  el cliente sabe que va a ganar antes de jugar, y la vista de juego queda
 *  limpia, sin distracciones. */
export default function GiraYGanaPage() {
  const { openLogin } = useAuth();

  return (
    <>
      {/* Cinta superior -- primer elemento de la pagina, asi que queda
          tocando el navbar sin ningun hueco: LandingLayout ya deja el
          espacio exacto de la barra fija arriba de este contenido. */}
      <Marquee mensajes={MENSAJES_CINTA} />

      {/* Hero -- breve a proposito: la explicacion completa vive en las dos
          secciones de abajo, esto es solo la puerta de entrada.

          Dos columnas en escritorio: texto a la izquierda, ruleta 3D
          decorativa a la derecha. Esta es la vista general, asi que la
          ruleta gira todo el tiempo sola (preview) -- no asigna nada, no
          reacciona a clics; es la misma pieza real, solo que en modo
          "aparador". La que de verdad gira y entrega el bono vive en
          "/jugar", detras del boton "Gira y Gana". */}
      <section className="relative overflow-hidden px-4 pb-24 pt-10">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 30% 20%, rgba(107,50,214,0.18) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 75% 70%, rgba(0,196,216,0.1) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* "Volver al inicio" vive DENTRO del hero -- antes estaba en un div
            aparte por encima de esta seccion, expuesto directo sobre la foto
            de fondo sin el velo oscuro de arriba, y caia justo sobre una zona
            clara de la imagen (se veia como montado en un panel propio). Aqui
            adentro queda cubierto por el mismo degradado que ya oscurece el
            resto del hero, sin tocar ni la imagen de fondo ni su velo. */}
        <div className="relative z-10 mx-auto mb-8 max-w-6xl">
          <VolverInicio />
        </div>

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-6">
          <div className="flex flex-col items-center text-center animate-fade-in-up lg:items-start lg:text-left">
            <span
              className="mb-5 inline-block rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em]"
              style={{
                color: "#00C4D8",
                background: "rgba(0,196,216,0.1)",
                border: "1px solid rgba(0,196,216,0.22)",
              }}
            >
              Promoción de Bienvenida
            </span>

            {/* Texto corto y directo a propósito: esta es la puerta de
                entrada, no el lugar para explicar la promoción -- eso ya lo
                hacen Premios y Cómo Funciona, justo debajo. Aquí solo hay que
                dar ganas de girar y de venir a la sede. */}
            <h1
              className="mb-4 text-5xl font-black leading-tight text-white md:text-6xl"
              style={{ letterSpacing: "-0.01em" }}
            >
              Gira,
              <br />
              descubre y
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #D4A827 0%, #ECC84C 40%, #00C4D8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                celebra.
              </span>
            </h1>

            <p className="mb-9 max-w-lg text-base leading-relaxed" style={{ color: "rgba(237,232,252,0.55)" }}>
              Cada giro tiene premio. Activa tu bono de bienvenida en la ruleta y vive la mejor
              experiencia en Centro Club Mirage Arauca.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Link
                to="/jugar"
                className="flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-bold text-white transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #6B32D6 0%, #1A5ED8 100%)",
                  boxShadow: "0 6px 28px rgba(107,50,214,0.4)",
                  letterSpacing: "0.03em",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 36px rgba(107,50,214,0.6)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 6px 28px rgba(107,50,214,0.4)"; }}
              >
                <RotateCw size={16} color="white" strokeWidth={1.6} />
                Gira y Gana
              </Link>

              {/* Antes era un enlace de texto ("¿Ya tienes cuenta? Inicia
                  sesión"); ahora es un boton propio, igual de visible que el
                  primario pero en contorno para no competir con el. */}
              <button
                onClick={openLogin}
                className="rounded-full px-8 py-3.5 text-sm font-bold transition-all duration-200"
                style={{
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: "rgba(237,232,252,0.85)",
                  background: "rgba(255,255,255,0.03)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.32)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }}
              >
                Ya tengo cuenta
              </button>
            </div>
          </div>

          {/* preview: gira sola en bucle, sin spinCommand ni onSpinComplete --
              pointer-events:none de fabrica (lo pone el propio Roulette3D),
              asi que nunca intercepta clics destinados al resto de la pagina.

              relative para anclar la mascota, que se superpone en la esquina
              inferior izquierda -- misma posicion que en la referencia. */}
          <div className="relative h-[320px] w-full sm:h-[400px] lg:h-[440px]">
            <Roulette3D preview quality="high" className="h-full w-full" />

            <img
              src={fichardoBono}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 z-10 w-28 -translate-x-3 translate-y-3 sm:w-36 sm:-translate-x-4 sm:translate-y-4 lg:w-40"
              style={{ filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.45))" }}
            />

            {/* Destellos con forma de carta, repartidos alrededor de la
                ruleta -- evitan la esquina inferior izquierda, donde ya esta
                la mascota, para no amontonar todo en el mismo rincon. */}
            {/* Todas con posicion positiva (nunca "-5%" ni similares): en
                escritorio esta caja tiene margen de sobra alrededor y un
                desborde negativo no se notaba, pero en movil ocupa el 100%
                del ancho de la seccion y ese mismo desborde quedaba cortado
                por el overflow-hidden de la seccion -- la carta se veia
                partida a la mitad. Con todo hacia adentro, la ruleta se ve
                completa en cualquier ancho de pantalla. */}
            <CartaDestello palo="pica" color="#D4A827" style={{ top: "1%", left: "2%" }} size={32} rotate={-14} />
            <CartaDestello palo="diamante" color="#00C4D8" style={{ top: "1%", right: "4%" }} size={30} rotate={12} delay={0.7} />
            <CartaDestello palo="trebol" color="#8B5CE8" style={{ top: "42%", right: "3%" }} size={34} rotate={-8} delay={1.4} />
            <CartaDestello palo="corazon" color="#ECC84C" style={{ bottom: "3%", right: "5%" }} size={26} rotate={16} delay={0.35} />
            <CartaDestello palo="diamante" color="#4DE0EE" style={{ top: "16%", left: "3%" }} size={24} rotate={-20} delay={2.1} />
          </div>
        </div>
      </section>

      {/* Cinta inferior -- cierra el hero justo antes de Premios. En sentido
          contrario a la de arriba, mismo criterio que en Inicio: que no
          parezca un calco de la primera. */}
      <Marquee mensajes={MENSAJES_CINTA} direccion="der" />

      {/* Que hay en juego, antes de jugar. */}
      <PrizesSection />

      {/* Como funciona, paso a paso. */}
      <HowItWorksSection />

      {/* Segundo llamado a la accion, al cierre del paso a paso -- para quien
          leyo hasta aqui y ya esta listo para girar, sin tener que volver
          arriba a buscar el primer boton. */}
      <div className="px-4 pb-28 text-center md:pb-40">
        <Link
          to="/jugar"
          className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-bold text-white transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #6B32D6 0%, #1A5ED8 100%)",
            boxShadow: "0 6px 28px rgba(107,50,214,0.4)",
            letterSpacing: "0.03em",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 36px rgba(107,50,214,0.6)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 6px 28px rgba(107,50,214,0.4)"; }}
        >
          <RotateCw size={16} color="white" strokeWidth={1.6} />
          Gira y Gana
        </Link>
      </div>
    </>
  );
}
