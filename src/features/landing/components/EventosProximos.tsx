import { PartyPopper } from "lucide-react";

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
        <PartyPopper size={46} strokeWidth={1.8} />
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
