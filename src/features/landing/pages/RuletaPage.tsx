import { useEffect, useState } from "react";
import { ChevronLeft, Info, Calendar, Gift } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { mapPremioToPrize, type Prize } from "../data/prizes";
import PrizeRevealModal from "../components/PrizeRevealModal";
import BonosVigenciaModal from "../components/BonosVigenciaModal";
import Roulette3D from "../roulette/components/Roulette3D";
import { TOTAL_POCKETS } from "../roulette/constants/roulette.constants";
import type { RouletteSpinCommand } from "../roulette/types/roulette.types";
import { useRuletaSonido } from "../roulette/hooks/useRuletaSonido";
import fichardo from "@/imports/fichardo-mirage.png";
import {
  ApiError,
  decodeTicketExpiraEnMs,
  fetchGirosRestantes,
  fetchVigenciaPromocion,
  girarRuleta,
  setVisitanteToken,
  type GiroResultado,
} from "@/shared/api/client";

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
 *  eso. La logica que la conecta si es propia: el premio lo decide el
 *  SERVIDOR (POST /api/ruleta/girar-anonimo, con un sorteo ponderado real y
 *  limite de giros llevado en base de datos), nunca el navegador.
 *
 *  El casillero (targetPocket) en el que se detiene la ruleta es puramente
 *  visual: la ruleta tiene 37 casilleros (0-36, disposicion europea real) y
 *  la promocion solo reparte 3 bonos, asi que no hay una correspondencia 1:1.
 *  Se elige un casillero al azar para el espectaculo. El premio real lo
 *  decide el SERVIDOR (POST /api/ruleta/girar-anonimo) antes de que la
 *  ruleta empiece a girar -- si esa llamada falla (por ejemplo, ya se
 *  agotaron los giros en otra pestana), no se anima nada y se muestra el
 *  error en su lugar. */
export default function RuletaPage() {
  const navigate = useNavigate();
  const { iniciarGiro, detenerGiro, reproducirPremio } = useRuletaSonido();
  const [spinning, setSpinning] = useState(false);
  const [spinsUsed, setSpinsUsed] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [spinCommand, setSpinCommand] = useState<RouletteSpinCommand | null>(null);
  const [pendingResultado, setPendingResultado] = useState<GiroResultado | null>(null);
  const [ticketExpiraEnMs, setTicketExpiraEnMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargandoGiro, setCargandoGiro] = useState(false);
  const [vigenciaHasta, setVigenciaHasta] = useState<Date | null>(null);
  const [showBonosModal, setShowBonosModal] = useState(false);

  // Al entrar, se consulta cuantos giros lleva este visitante -- asi el
  // contador es exacto desde el primer render y no asume que nadie ha
  // girado, aunque recargue la pagina o vuelva en otra sesion del navegador.
  useEffect(() => {
    fetchGirosRestantes()
      .then((r) => {
        setSpinsUsed(r.usados);
        setVisitanteToken(r.visitanteToken);
      })
      .catch(() => {
        // Si falla (API caida), se deja en 0: el primer giro real ya
        // reportara el error que corresponda.
      });
    fetchVigenciaPromocion()
      .then((r) => setVigenciaHasta(r.vigenciaHasta ? new Date(r.vigenciaHasta) : null))
      .catch(() => {});
  }, []);

  const spinsLeft = Math.max(0, MAX_SPINS - spinsUsed);
  const allSpinsUsed = spinsLeft <= 0;
  const daysLeft = vigenciaHasta ? Math.max(0, Math.ceil((vigenciaHasta.getTime() - Date.now()) / 86400000)) : null;
  // timeZone fija a Colombia: sin esto, alguien viendo el sitio desde otra
  // zona horaria podria leer un dia distinto para la misma fecha limite.
  const vigenciaLabel = vigenciaHasta
    ? vigenciaHasta.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Bogota" })
    : null;

  const handleSpin = async () => {
    if (spinning || allSpinsUsed || cargandoGiro) return;
    setError(null);
    setCargandoGiro(true);

    try {
      const resultado = await girarRuleta();
      setVisitanteToken(resultado.visitanteToken);
      setPendingResultado(resultado);
      setSpinning(true);
      // Casillero puramente decorativo -- ver nota de arriba.
      const targetPocket = Math.floor(Math.random() * TOTAL_POCKETS);
      setSpinCommand({ id: Date.now(), targetPocket, durationMs: DURACION_GIRO_MS });
      iniciarGiro(DURACION_GIRO_MS);
    } catch (e) {
      const mensaje = e instanceof ApiError ? e.message : "No se pudo girar la ruleta. Intenta de nuevo.";
      setError(mensaje);
      if (e instanceof ApiError && typeof (e.data as { usados?: number })?.usados === "number") {
        setSpinsUsed((e.data as { usados: number }).usados);
      }
    } finally {
      setCargandoGiro(false);
    }
  };

  // La ruleta 3D avisa cuando termina de girar y caer; el premio ya estaba
  // decidido por el servidor desde el clic, asi que aqui solo se revela.
  // El sonido de giro termina EXACTAMENTE aqui -- el mismo instante en que
  // se entrega el bono -- y el de premio suena una sola vez, justo despues.
  const handleSpinComplete = () => {
    if (!pendingResultado) return;
    detenerGiro();
    reproducirPremio();
    setWonPrize(mapPremioToPrize(pendingResultado.premio));
    setSpinsUsed(pendingResultado.usados);
    setPendingResultado((prev) => {
      if (prev) {
        sessionStorage.setItem("ccm_ultimo_ticket", prev.ticket);
        setTicketExpiraEnMs(decodeTicketExpiraEnMs(prev.ticket));
      }
      return null;
    });
    setSpinning(false);
    setShowResult(true);
  };

  const handleIgnore = () => {
    setShowResult(false);
    setWonPrize(null);
  };

  const handleRegister = () => {
    setShowResult(false);
    const ticket = sessionStorage.getItem("ccm_ultimo_ticket");
    navigate("/registro", { state: { ticket, prize: wonPrize } });
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
            <ChevronLeft size={16} strokeWidth={1.7} />
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
              <Info size={12} strokeWidth={1.6} className="flex-shrink-0" />
              {allSpinsUsed ? (
                <span>Usaste tus {MAX_SPINS} intentos</span>
              ) : (
                <span>
                  Tienes <strong style={{ color: "#EDE8FC" }}>{MAX_SPINS} intentos</strong> en total ·{" "}
                  {spinsLeft === MAX_SPINS ? `te quedan ${spinsLeft}` : `te queda${spinsLeft === 1 ? "" : "n"} ${spinsLeft}`}
                </span>
              )}
            </div>

            {vigenciaLabel && (
              <div
                className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full flex-wrap justify-center"
                style={{
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.18)",
                  color: "rgba(52,211,153,0.85)",
                }}
              >
                <Calendar size={11} strokeWidth={1.6} />
                <span>Redime hasta el</span>
                <strong style={{ color: "#34D399" }}>{vigenciaLabel}</strong>
                <span style={{ color: "rgba(237,232,252,0.2)" }}>·</span>
                <span>quedan {daysLeft} días</span>
              </div>
            )}
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
            disabled={spinning || allSpinsUsed || cargandoGiro}
            className="px-10 py-4 rounded-full font-black text-base transition-all duration-200 disabled:cursor-not-allowed"
            style={{
              background:
                spinning || allSpinsUsed || cargandoGiro
                  ? "rgba(107,50,214,0.35)"
                  : "linear-gradient(135deg, #6B32D6 0%, #1A5ED8 100%)",
              color: "#fff",
              boxShadow: spinning || allSpinsUsed || cargandoGiro ? "none" : "0 6px 28px rgba(107,50,214,0.4)",
              letterSpacing: "0.05em",
              minWidth: 240,
            }}
          >
            {spinning ? "Girando..." : cargandoGiro ? "Un momento..." : allSpinsUsed ? "Giros agotados" : "Girar Ruleta"}
          </button>

          {error && (
            <p
              className="mt-3 text-xs rounded-full px-4 py-2 inline-block"
              style={{ background: "rgba(239,68,68,0.08)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.18)" }}
            >
              {error}
            </p>
          )}

          <p className="mt-3 text-xs" style={{ color: "rgba(237,232,252,0.35)" }}>
            Un bono por persona ·{" "}
            <Link
              to="/legal/condiciones-promocion?from=ruleta"
              className="underline underline-offset-2 transition-colors"
              style={{ color: "rgba(237,232,252,0.5)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#EDE8FC"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.5)"; }}
            >
              Ver términos
            </Link>
          </p>

          {/* Justo debajo de la ruleta: abre el modal con los 3 bonos y la
              vigencia PROPIA de cada uno (no la fecha unica y generica que ya
              se ve arriba, antes de girar). */}
          <button
            onClick={() => setShowBonosModal(true)}
            className="mt-4 mx-auto flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition-colors"
            style={{ background: "rgba(212,168,39,0.08)", border: "1px solid rgba(212,168,39,0.22)", color: "#D4A827" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,168,39,0.14)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(212,168,39,0.08)"; }}
          >
            <Gift size={13} strokeWidth={1.7} />
            Ver todos los bonos y sus vigencias
          </button>
        </div>
      </section>

      {showBonosModal && <BonosVigenciaModal onClose={() => setShowBonosModal(false)} />}

      {/* Prize reveal modal */}
      {showResult && wonPrize && (
        <PrizeRevealModal
          prize={wonPrize}
          spinsLeft={spinsLeft}
          expiraEnMs={ticketExpiraEnMs}
          onRegister={handleRegister}
          onIgnore={handleIgnore}
        />
      )}
    </>
  );
}
