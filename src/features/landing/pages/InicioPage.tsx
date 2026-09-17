import { Link } from "react-router";
import Carousel, { type Slide } from "../components/Carousel";
import VideoShowcase from "../components/VideoShowcase";
import EventosProximos from "../components/EventosProximos";
import MapaSedes from "@/shared/components/MapaSedes";
import Marquee from "@/shared/components/Marquee";
import { MENSAJES_CINTA } from "../data/mensajesCinta";
import TituloSeccion from "@/shared/components/TituloSeccion";
import { SEDES } from "@/shared/data/sedes";
import foto01 from "@/imports/videos/poster-01.jpg";
import foto02 from "@/imports/videos/poster-02.jpg";
import foto03 from "@/imports/videos/poster-03.jpg";

// Provisionales: son los primeros fotogramas de los videos, lo único que hay
// hoy en imports/ con aspecto de foto del local. Sustitúyelos por fotos
// propias cuando las tengas -- basta cambiar estos tres import.
const SLIDES: Slide[] = [
  { src: foto03, alt: "Interior de Centro Club Mirage, Arauca" },
  { src: foto01, alt: "Sala de máquinas de Centro Club Mirage" },
  { src: foto02, alt: "Máquinas y acumulados de Centro Club Mirage" },
];

interface Acceso {
  to: string;
  titulo: string;
  desc: string;
  icono: React.ReactNode;
  destacado?: boolean;
}

const ACCESOS: Acceso[] = [
  {
    to: "/",
    titulo: "Gira y Gana",
    desc: "Gira la ruleta y descubre tu bono de bienvenida.",
    destacado: true,
    icono: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 12a4 4 0 018 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 9v3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    to: "/premios",
    titulo: "Premios",
    desc: "Bonos de $10.000, $20.000 y $50.000.",
    icono: (
      <>
        <path d="M7 4h10v9a5 5 0 01-10 0V4z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 7H4a3 3 0 003 3M17 7h3a3 3 0 01-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 18v3M9 21h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    to: "/como-funciona",
    titulo: "Cómo Funciona",
    desc: "Tres pasos: gira, descubre y redime.",
    icono: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.7-1.5 1.2-1.5 2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 17v.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
  },
  {
    to: "/sedes",
    titulo: "Sedes",
    desc: `${SEDES.length} locales en Arauca para redimir tu bono.`,
    icono: (
      <>
        <path d="M12 2c-3.6 0-6.5 2.9-6.5 6.5 0 4.7 6.5 13 6.5 13s6.5-8.3 6.5-13C18.5 4.9 15.6 2 12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="12" cy="8.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
  {
    to: "/faq",
    titulo: "Preguntas",
    desc: "Resolvemos las dudas más frecuentes.",
    icono: (
      <>
        <path d="M21 12a9 9 0 11-3.2-6.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.7-1.5 1.2-1.5 2.2M12 17v.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
];

export default function InicioPage() {
  return (
    <>
      {/* Bienvenida. Va antes del carrusel a propósito: pegado al navbar, el
          carrusel entraba en la vista sin ninguna presentación. */}
      <section className="px-6 py-20 text-center md:py-24">
        <div className="mx-auto max-w-2xl">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "#D4A827" }}
          >
            Bienvenido a
          </p>

          <h1
            className="mt-4 text-4xl font-black uppercase text-white md:text-6xl"
            style={{ letterSpacing: "-0.01em" }}
          >
            Centro Club{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #D4A827 0%, #ECC84C 45%, #00C4D8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Mirage
            </span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed"
            style={{ color: "rgba(237,232,252,0.6)" }}
          >
            Vive una experiencia de entretenimiento diferente en nuestras salas de juego en
            Arauca. Disfruta momentos inolvidables, beneficios exclusivos y toda la emoción de
            Centro Club Mirage en un ambiente seguro y responsable.
          </p>

          <p
            className="mx-auto mt-6 max-w-lg text-base font-bold leading-relaxed"
            style={{ color: "#D4A827" }}
          >
            Atrévete a visitarnos y descubre todo lo que tenemos preparado para ti.
          </p>
        </div>
      </section>

      <Marquee mensajes={MENSAJES_CINTA} />

      {/* Carrusel a todo el ancho: LandingLayout no mete padding lateral, así
          que llega de borde a borde sin sacarlo del flujo con trucos de ancho
          negativo. */}
      <Carousel slides={SLIDES} variante="completo" />

      {/* La segunda cinta cierra el carrusel. Va en sentido contrario para que
          no parezca un calco de la de arriba. */}
      <Marquee mensajes={MENSAJES_CINTA} direccion="der" />

      {/* Accesos rápidos.
          Los tres apartados de abajo comparten el mismo py: antes cada uno
          traía el suyo y quedaban pegados de forma desigual. */}
      <section className="px-4 py-28 md:py-40">
        <div className="mx-auto max-w-5xl">
          <TituloSeccion antetitulo="Explora" titulo="Accesos rápidos" />

          {/* flex y no grid: son cinco tarjetas, y con un grid de tres
              columnas las dos últimas quedaban pegadas a la izquierda con un
              hueco a la derecha. Envolviendo con flex, la fila incompleta se
              centra sola. Los anchos replican las columnas: 3 arriba, 2 abajo
              (el resto del gap-4 repartido entre las tarjetas). */}
          <div className="flex flex-wrap justify-center gap-4">
            {ACCESOS.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="group flex w-full items-start gap-4 rounded-2xl p-5 transition-all duration-300 sm:w-[calc(50%_-_0.5rem)] lg:w-[calc(33.333%_-_0.667rem)]"
                style={{
                  background: "rgba(14,11,40,0.8)",
                  border: a.destacado
                    ? "1px solid rgba(212,168,39,0.4)"
                    : "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,168,39,0.5)"; }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = a.destacado
                    ? "rgba(212,168,39,0.4)"
                    : "rgba(255,255,255,0.07)";
                }}
              >
                <span
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "rgba(212,168,39,0.1)", color: "#D4A827" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    {a.icono}
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-bold text-white">{a.titulo}</span>
                  <span
                    className="mt-1 block text-sm leading-snug"
                    style={{ color: "rgba(237,232,252,0.5)" }}
                  >
                    {a.desc}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sedes con mapa */}
      <section className="px-4 pb-28 md:pb-40">
        <div className="mx-auto max-w-6xl">
          <TituloSeccion
            antetitulo={`${SEDES.length} sedes en Arauca`}
            titulo="Nuestras Sedes"
          />
          <MapaSedes />
        </div>
      </section>

      {/* Los videos del local: información general del casino. */}
      <section className="px-4 pb-28 md:pb-40">
        <div className="mx-auto max-w-5xl">
          <TituloSeccion
            antetitulo="Nuestro casino en video"
            titulo="Conoce Centro Club Mirage"
          />
          <VideoShowcase />
        </div>
      </section>

      {/* Agenda -- cierra la vista. */}
      <section className="px-4 pb-28 md:pb-40">
        <div className="mx-auto max-w-5xl">
          <TituloSeccion antetitulo="Agenda" titulo="Eventos Próximos" />
          <EventosProximos />
        </div>
      </section>
    </>
  );
}
