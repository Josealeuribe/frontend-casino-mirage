import { useEffect, useState, type ReactNode } from "react";

export interface Slide {
  src: string;
  alt: string;
}

interface Props {
  slides: Slide[];
  /** Milisegundos entre avances automáticos. 0 lo desactiva. */
  intervalo?: number;
  /** "completo" ocupa todo el ancho de la ventana, sin bordes ni esquinas
   *  redondeadas: es la cabecera de la vista. "tarjeta" lo deja como bloque
   *  dentro del contenido. */
  variante?: "completo" | "tarjeta";
  /** Contenido superpuesto sobre la imagen, centrado abajo. */
  encima?: ReactNode;
}

export default function Carousel({
  slides,
  intervalo = 5000,
  variante = "tarjeta",
  encima,
}: Props) {
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);

  const ir = (i: number) => setActual((i + slides.length) % slides.length);

  useEffect(() => {
    if (intervalo <= 0 || pausado || slides.length < 2) return;
    const t = setInterval(() => setActual((i) => (i + 1) % slides.length), intervalo);
    return () => clearInterval(t);
    // `actual` entra a propósito: cada vez que se cambia de lámina a mano el
    // temporizador se reinicia, en vez de saltar al instante si el avance
    // automático estaba a punto de dispararse.
  }, [intervalo, pausado, slides.length, actual]);

  if (slides.length === 0) return null;

  const completo = variante === "completo";

  return (
    <div
      className={`relative overflow-hidden ${completo ? "w-full" : "rounded-3xl"}`}
      style={
        completo
          ? { borderBottom: "1px solid rgba(255,255,255,0.08)" }
          : { border: "1px solid rgba(255,255,255,0.08)", background: "rgba(14,11,40,0.8)" }
      }
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      {/* A ancho completo el alto no puede salir de la proporción: en una
          pantalla ancha, 16/9 daría más de 1000px y el resto de la vista
          quedaría fuera de pantalla. */}
      <div
        className={
          completo
            ? "relative h-[55vh] max-h-[560px] min-h-[320px] w-full"
            : "relative aspect-[16/9] w-full"
        }
      >
        {slides.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            aria-hidden={i !== actual}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: i === actual ? 1 : 0 }}
          />
        ))}

        {/* Degradado inferior: sin él, los puntos y el texto superpuesto se
            pierden sobre una foto clara. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: encima
              ? "linear-gradient(to top, rgba(8,7,24,0.92) 0%, rgba(8,7,24,0.45) 45%, transparent 75%)"
              : "linear-gradient(to top, rgba(8,7,24,0.75) 0%, transparent 45%)",
          }}
        />

        {encima && (
          <div className="absolute inset-x-0 bottom-0 px-6 pb-16 text-center">{encima}</div>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <Flecha lado="izq" onClick={() => ir(actual - 1)} />
          <Flecha lado="der" onClick={() => ir(actual + 1)} />

          <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.src}
                onClick={() => ir(i)}
                aria-label={`Ver imagen ${i + 1} de ${slides.length}`}
                aria-current={i === actual}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === actual ? 26 : 8,
                  background: i === actual ? "#D4A827" : "rgba(237,232,252,0.4)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Flecha({ lado, onClick }: { lado: "izq" | "der"; onClick: () => void }) {
  const izq = lado === "izq";
  return (
    <button
      onClick={onClick}
      aria-label={izq ? "Imagen anterior" : "Imagen siguiente"}
      className="absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200"
      style={{
        [izq ? "left" : "right"]: 16,
        background: "rgba(8,7,24,0.6)",
        border: "1px solid rgba(255,255,255,0.14)",
        color: "rgba(237,232,252,0.85)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,168,39,0.25)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(8,7,24,0.6)"; }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d={izq ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
