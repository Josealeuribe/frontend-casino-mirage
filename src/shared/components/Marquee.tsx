interface Props {
  /** Frases que desfilan, en orden. */
  mensajes: string[];
  /** Segundos que tarda la cinta en dar una vuelta completa. Más alto = más
   *  lento. Con muchas frases conviene subirlo o pasan disparadas. */
  duracion?: number;
  direccion?: "izq" | "der";
}

/** Cinta de mensajes en movimiento continuo.
 *
 *  Reutilizable: se usa encima y debajo del carrusel de Inicio, y sirve para
 *  cualquier otra vista. El desplazamiento es CSS puro -- ni JS ni listeners
 *  de scroll -- así que no cuesta nada aunque haya varias en la página.
 *
 *  NUNCA debe pararse ni quedar en blanco -- por diseño, no por casualidad:
 *  `marquee-izq`/`marquee-der` (index.css) llevan `infinite` sin duración
 *  total ni conteo de vueltas, y `MENSAJES_CINTA` es una lista fija que
 *  nunca queda vacía, así que el único `return null` de aquí abajo (mensajes
 *  vacíos) nunca se dispara en el uso real del sitio. */
export default function Marquee({ mensajes, duracion = 32, direccion = "izq" }: Props) {
  if (mensajes.length === 0) return null;

  // El grupo va duplicado: el primero es el que se lee, el segundo solo
  // rellena el hueco que deja el primero al salir por el borde.
  const grupo = (oculto: boolean) => (
    <ul
      className="flex shrink-0 items-center"
      aria-hidden={oculto || undefined}
    >
      {mensajes.map((m, i) => (
        <li key={`${m}-${i}`} className="flex items-center">
          <span
            className="whitespace-nowrap px-7 py-3.5 text-sm font-bold uppercase md:text-base"
            style={{ color: "#150F04", letterSpacing: "0.14em" }}
          >
            {m}
          </span>
          {/* Punto separador, mismo negro que el texto. */}
          <span aria-hidden="true" style={{ color: "#150F04" }}>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <circle cx="4" cy="4" r="4" fill="currentColor" />
            </svg>
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="relative w-full overflow-hidden animate-marquee-magia"
      style={{
        // El destello va en el FONDO (letras en negro solido encima): un
        // degradado ocre metalico con un tramo claro en el medio que, al
        // animar background-position, "viaja" de un lado a otro en bucle --
        // como una marquesina de luces reales pasando.
        backgroundImage:
          "linear-gradient(100deg, #6E5419 0%, #9E7B27 30%, #F5D67B 50%, #9E7B27 70%, #6E5419 100%)",
        // Marco dorado brillante (antes era #6E5419, un ocre oscuro que se
        // perdia contra el propio fondo de la cinta) + el brillo pulsante de
        // .animate-marquee-magia -- ese es el "toque magico" pedido.
        borderTop: "2px solid #F5D67B",
        borderBottom: "2px solid #F5D67B",
      }}
    >
      {/* w-max evita que la pista se ajuste al ancho del padre y parta las
          frases en varias líneas. */}
      <div
        className="marquee-pista flex w-max"
        data-dir={direccion}
        style={{ ["--marquee-dur" as string]: `${duracion}s` }}
      >
        {grupo(false)}
        {grupo(true)}
      </div>
    </div>
  );
}
