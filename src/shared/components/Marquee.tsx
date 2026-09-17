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
 *  de scroll -- así que no cuesta nada aunque haya varias en la página. */
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
            style={{ color: "#ECC84C", letterSpacing: "0.14em" }}
          >
            {m}
          </span>
          {/* Rombo separador, más apagado para que no compita con el texto. */}
          <span aria-hidden="true" style={{ color: "rgba(212,168,39,0.55)" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 0.5l1.6 3.9L11.5 6l-3.9 1.6L6 11.5 4.4 7.6.5 6l3.9-1.6z" fill="currentColor" />
            </svg>
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, rgba(212,168,39,0.14) 0%, rgba(212,168,39,0.07) 50%, rgba(212,168,39,0.14) 100%)",
        borderTop: "1px solid rgba(212,168,39,0.35)",
        borderBottom: "1px solid rgba(212,168,39,0.35)",
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
