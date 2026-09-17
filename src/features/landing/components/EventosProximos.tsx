/** Agenda de eventos.
 *
 *  Hoy no hay ninguno programado, así que solo se pinta el estado vacío. Cuando
 *  haya eventos reales, este es el sitio: añade la lista y sustituye la tarjeta
 *  por la rejilla. No dejé el renderizado de tarjetas escrito de antemano
 *  porque no sabemos aún qué campos llevará cada evento -- fecha, sede, aforo,
 *  precio -- y adivinarlo ahora es escribir código que habrá que rehacer. */
export default function EventosProximos() {
  return (
    <div
      className="mx-auto max-w-xl rounded-3xl px-8 py-12 text-center"
      style={{
        background: "rgba(14,11,40,0.8)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* SVG y no el emoji 🎉 de la referencia: el emoji lo dibuja cada
          sistema operativo a su manera y aquí ninguno de los iconos del sitio
          es emoji. Así queda igual en todas partes y en el dorado del tema. */}
      <span
        className="mx-auto mb-5 flex h-14 w-14 items-center justify-center"
        style={{ color: "#D4A827" }}
        aria-hidden="true"
      >
        <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
          {/* Cono */}
          <path
            d="M6 40l9.5-21.5L27.5 30.5 6 40z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M12 27l7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          {/* Serpentinas saliendo */}
          <path
            d="M29 19c3-3 3-7 1-9M34 24c4-1 6-4 6-7M25 13c1-4 4-6 7-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Confeti */}
          <circle cx="38" cy="14" r="1.6" fill="currentColor" />
          <circle cx="30" cy="6" r="1.4" fill="currentColor" />
          <circle cx="41" cy="30" r="1.4" fill="currentColor" />
        </svg>
      </span>

      <h3 className="text-2xl font-black text-white">¡Próximamente!</h3>

      <p
        className="mx-auto mt-4 max-w-md text-base leading-relaxed"
        style={{ color: "rgba(237,232,252,0.55)" }}
      >
        Estamos preparando nuevos eventos y noches especiales en nuestras sedes. Muy pronto
        encontrarás aquí toda la agenda con fechas y detalles.
      </p>
    </div>
  );
}
