import { Link } from "react-router";
import { RotateCw, Trophy, HelpCircle, MapPin } from "lucide-react";
import Carousel, { type Slide } from "../components/Carousel";
import VideoShowcase from "../components/VideoShowcase";
import EventosProximos from "../components/EventosProximos";
import MapaSedes from "@/shared/components/MapaSedes";
import Marquee from "@/shared/components/Marquee";
import { MENSAJES_CINTA } from "../data/mensajesCinta";
import TituloSeccion from "@/shared/components/TituloSeccion";
import { SEDES } from "@/shared/data/sedes";
// Las "-web" son copias redimensionadas (1920px de ancho) de las fotos
// reales que llegaron a imports/: los originales pesaban 3-16 MB cada uno
// (hasta 5168x4134px, resolucion de camara) para mostrarse en un carrusel
// que nunca los necesita a mas de 1920px de ancho. Con eso decodificando en
// el navegador, el carrusel se hubiera sentido trabado. Los originales
// quedan intactos en imports/ por si hacen falta en otro tamano.
//
// La foto "-2" no llego (el nombre salta de 1 a 3 y 4), asi que foto02 usa
// la 4 -- son tres fotos reales distintas, solo que numeradas 1/3/4 en vez
// de 1/2/3.
import foto01 from "@/imports/imagen-casino-arauca-1-web.jpg";
import foto02 from "@/imports/imagen-casino-arauca-4-web.jpg";
import foto03 from "@/imports/imagen-casino-arauca-3-web.jpg";

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
    icono: <RotateCw size={22} strokeWidth={1.5} />,
  },
  {
    to: "/premios",
    titulo: "Premios",
    desc: "Bonos de $10.000, $20.000 y $50.000.",
    icono: <Trophy size={22} strokeWidth={1.5} />,
  },
  {
    to: "/como-funciona",
    titulo: "Cómo Funciona",
    desc: "Tres pasos: gira, descubre y redime.",
    icono: <HelpCircle size={22} strokeWidth={1.5} />,
  },
  {
    to: "/sedes",
    titulo: "Sedes",
    desc: `${SEDES.length} locales en Arauca para redimir tu bono.`,
    icono: <MapPin size={22} strokeWidth={1.5} />,
  },
  {
    to: "/faq",
    titulo: "Preguntas",
    desc: "Resolvemos las dudas más frecuentes.",
    icono: <HelpCircle size={22} strokeWidth={1.5} />,
  },
];

export default function InicioPage() {
  return (
    <>
      {/* Bienvenida. Va antes del carrusel a propósito: pegado al navbar, el
          carrusel entraba en la vista sin ninguna presentación.

          Poco padding a propósito: con py-20/24 este bloque por si solo ya
          ocupaba casi toda la altura de pantalla, y el carrusel y las cintas
          (lo que de verdad vende la vista) quedaban fuera del viewport
          inicial -- habia que bajar para verlos. Achicando el aire de arriba
          y de abajo, y los margenes entre lineas, ambos entran de una vez. */}
      <section className="px-6 pt-8 pb-6 text-center md:pt-12 md:pb-8">
        <div className="mx-auto max-w-2xl">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "#D4A827" }}
          >
            Bienvenido a
          </p>

          <h1
            className="mt-3 text-3xl font-black uppercase text-white md:text-5xl"
            style={{ letterSpacing: "-0.01em" }}
          >
            Club{" "}
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
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed md:text-base"
            style={{ color: "rgba(237,232,252,0.6)" }}
          >
            Vive una experiencia de entretenimiento diferente en nuestras salas de juego en
            Arauca. Disfruta momentos inolvidables, beneficios exclusivos y toda la emoción de
            Centro Club Mirage en un ambiente seguro y responsable.
          </p>

          <p
            className="mx-auto mt-3 max-w-lg text-sm font-bold leading-relaxed md:text-base"
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
                  {a.icono}
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
