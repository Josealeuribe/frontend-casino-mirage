import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/features/auth/AuthContext";
import { pickPrize, type Prize } from "../data/prizes";
import PrizeRevealModal from "../components/PrizeRevealModal";
import Roulette3D from "../roulette/components/Roulette3D";
import { TOTAL_POCKETS } from "../roulette/constants/roulette.constants";
import type { RouletteSpinCommand } from "../roulette/types/roulette.types";
import fichardo from "@/imports/fichardo-mirage.png";

const MAX_SPINS = 3;

// Duracion recomendada por el propio motor 3D (ver Roulette3D.tsx): 5.8s deja
// ver completa la caida y los rebotes finales de la bola sin hacerse largo.
// La version anterior en SVG usaba 3s porque no tenia bola cayendo -- con
// geometria real la animacion necesita ese tiempo para leerse bien.
const DURACION_GIRO_MS = 5800;

/** Vista de juego -- vive aparte de "/" (la de informacion) para que aqui no
 *  aparezca nada mas que la ruleta: sin premios, sin pasos, sin distracciones.
 *  Quien llega hasta aqui ya vio los bonos y como funciona en la vista
 *  anterior; a esto vino a girar.
 *
 *  La ruleta 3D es la misma pieza (geometria, iluminacion, animacion) que ya
 *  se habia construido para Gran Casino Cucuta -- no se reescribio nada de
 *  eso. Lo que cambia aqui es la logica que la conecta: esta app no tiene
 *  backend, asi que el premio se decide localmente con pickPrize() en vez de
 *  una llamada a un servidor.
 *
 *  El casillero (targetPocket) en el que se detiene la ruleta es puramente
 *  visual: la ruleta tiene 37 casilleros (0-36, disposicion europea real) y
 *  la promocion solo reparte 3 bonos, asi que no hay una correspondencia 1:1.
 *  Se elige un casillero al azar para el espectaculo, y el premio real ya se
 *  decidio aparte con pickPrize() -- mismo criterio que ya traia el motor
 *  original (ver el comentario de RoulettePage.tsx de donde salio esto). */
export default function RuletaPage() {
  const { openLogin } = useAuth();
  const [spinning, setSpinning] = useState(false);
  const [spinsUsed, setSpinsUsed] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [spinCommand, setSpinCommand] = useState<RouletteSpinCommand | null>(null);
  const [pendingPrize, setPendingPrize] = useState<Prize | null>(null);

  const daysLeft = Math.max(0, Math.ceil((new Date("2026-09-30").getTime() - Date.now()) / 86400000));
  const spinsLeft = MAX_SPINS - spinsUsed;
  const allSpinsUsed = spinsLeft <= 0;

  const handleSpin = () => {
    if (spinning || allSpinsUsed) return;
    setSpinning(true);

    const prize = pickPrize();
    setPendingPrize(prize);

    // Casillero puramente decorativo -- ver nota de arriba.
    const targetPocket = Math.floor(Math.random() * TOTAL_POCKETS);
    setSpinCommand({ id: Date.now(), targetPocket, durationMs: DURACION_GIRO_MS });
  };

  // La ruleta 3D avisa cuando termina de girar y caer; el premio ya estaba
  // decidido desde el clic, asi que aqui solo se revela.
  const handleSpinComplete = () => {
    if (!pendingPrize) return;
    setWonPrize(pendingPrize);
    setPendingPrize(null);
    setSpinsUsed((n) => n + 1);
    setSpinning(false);
    setShowResult(true);
  };

  const handleIgnore = () => {
    setShowResult(false);
    setWonPrize(null);
  };

  const handleRegister = () => {
    setShowResult(false);
    openLogin();
  };

  return (
    <>
      <section className="relative flex flex-col items-center justify-center overflow-hidden pt-6 pb-16">
        {/* Solo los halos de color. La foto de fondo la pone LandingLayout. */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 30% 20%, rgba(107,50,214,0.18) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 75% 70%, rgba(0,196,216,0.1) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl animate-fade-in-up">
          {/* Vuelve a la vista de informacion, no a Inicio: si alguien llega
              aqui sin querer, el sitio a donde debe volver es a donde estaba,
              no al modulo de informacion general del casino.

              self-start: el resto de la columna va centrada (items-center),
              pero este enlace debe pegarse al borde izquierdo, no quedar a la
              mitad. text-left corrige el text-center que hereda del padre. */}
          <Link
            to="/"
            className="mb-3 self-start inline-flex items-center gap-2 text-left text-sm font-semibold transition-colors"
            style={{ color: "rgba(237,232,252,0.5)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#EDE8FC"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.5)"; }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Volver a Premios
          </Link>

          <span
            className="text-xs font-medium tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full"
            style={{
              color: "#00C4D8",
              background: "rgba(0,196,216,0.1)",
              border: "1px solid rgba(0,196,216,0.22)",
            }}
          >
            Promoción de Bienvenida
          </span>

          {/* Textos mas chicos y con menos aire a proposito: esta vista es
              para girar, no para leer. Con el titulo grande de antes, la
              ruleta quedaba fuera de la pantalla al entrar -- solo se veia
              texto, y habia que bajar para encontrarla. */}
          <h1
            className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight"
            style={{ letterSpacing: "-0.01em" }}
          >
            ¡Es tu momento{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #D4A827 0%, #ECC84C 40%, #00C4D8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              de ganar!
            </span>
          </h1>

          {/* Esta frase es distinta a la de "Gira y Gana" (la vista de
              informacion): esa es corta y busca traer al cliente hasta aqui;
              esta explica la accion inmediata, que es girar el boton que
              tiene justo debajo de la ruleta. */}
          <p className="text-sm mb-3 max-w-md leading-relaxed" style={{ color: "rgba(237,232,252,0.55)" }}>
            Presiona el botón, gira la ruleta y descubre el beneficio que tenemos para ti.
          </p>

          {/* Intentos y vigencia, antes de la ruleta -- el jugador debe saber
              a que atenerse antes de girar, no despues. */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div
              className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(237,232,252,0.55)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none" className="flex-shrink-0">
                <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.1" />
                <path d="M6.5 3.8V6.5M6.5 9.2v.1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
              {allSpinsUsed ? (
                <span>Usaste tus {MAX_SPINS} intentos</span>
              ) : (
                <span>
                  Tienes <strong style={{ color: "#EDE8FC" }}>{MAX_SPINS} intentos</strong> en total ·{" "}
                  {spinsLeft === MAX_SPINS ? `te quedan ${spinsLeft}` : `te queda${spinsLeft === 1 ? "" : "n"} ${spinsLeft}`}
                </span>
              )}
            </div>

            <div
              className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full flex-wrap justify-center"
              style={{
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.18)",
                color: "rgba(52,211,153,0.85)",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="2.5" width="10" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
                <path d="M4 2.5V1M8 2.5V1M1 5.5h10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
              <span>Redime hasta el</span>
              <strong style={{ color: "#34D399" }}>30 sep. 2026</strong>
              <span style={{ color: "rgba(237,232,252,0.2)" }}>·</span>
              <span>quedan {daysLeft} días</span>
            </div>
          </div>
        </div>

        {/* La ruleta 3D real: gira con targetPocket y avisa al terminar.
            El tamano replica el que ya traia probado el motor original.

            La rueda es un circulo dibujado dentro de una caja mas ancha que
            alta, asi que sus esquinas -- sobre todo la derecha -- quedan
            libres dentro del mismo contenedor. Ahi cabe la mascota sin
            necesidad de desbordar la caja ni tocar el overflow-hidden de la
            seccion, y sin interponerse: es una imagen suelta, no un control,
            asi que no cambia en nada como se gira ni como se reclama el
            premio. */}
        <div className="relative z-10 mt-4 h-[380px] w-full max-w-[820px] sm:h-[460px] md:h-[560px]">
          <Roulette3D
            spinCommand={spinCommand}
            onSpinComplete={handleSpinComplete}
            quality="high"
            className="h-full w-full"
          />

          <img
            src={fichardo}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 z-10 w-32 translate-x-2 translate-y-3 sm:w-44 sm:translate-x-4 sm:translate-y-4 md:w-52 lg:w-60"
            style={{ filter: "drop-shadow(0 14px 26px rgba(0,0,0,0.5))" }}
          />
        </div>

        {/* Boton pegado al borde inferior de la ruleta -- mismo lugar que en
            la referencia: el margen negativo lo monta sobre la base de la
            rueda en vez de dejarlo colgando con un hueco debajo. */}
        <div className="relative z-10 -mt-7 text-center md:-mt-10">
          <button
            onClick={handleSpin}
            disabled={spinning || allSpinsUsed}
            className="px-10 py-4 rounded-full font-black text-base transition-all duration-200 disabled:cursor-not-allowed"
            style={{
              background:
                spinning || allSpinsUsed
                  ? "rgba(107,50,214,0.35)"
                  : "linear-gradient(135deg, #6B32D6 0%, #1A5ED8 100%)",
              color: "#fff",
              boxShadow: spinning || allSpinsUsed ? "none" : "0 6px 28px rgba(107,50,214,0.4)",
              letterSpacing: "0.05em",
              minWidth: 240,
            }}
          >
            {spinning ? "Girando..." : allSpinsUsed ? "Giros agotados" : "Girar Ruleta"}
          </button>

          <p className="mt-3 text-xs" style={{ color: "rgba(237,232,252,0.35)" }}>
            Un bono por persona ·{" "}
            <Link
              to="/legal/condiciones-promocion"
              className="underline underline-offset-2 transition-colors"
              style={{ color: "rgba(237,232,252,0.5)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#EDE8FC"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.5)"; }}
            >
              Ver términos
            </Link>
          </p>
        </div>
      </section>

      {/* Prize reveal modal */}
      {showResult && wonPrize && (
        <PrizeRevealModal
          prize={wonPrize}
          spinsLeft={spinsLeft}
          onRegister={handleRegister}
          onIgnore={handleIgnore}
        />
      )}
    </>
  );
}
