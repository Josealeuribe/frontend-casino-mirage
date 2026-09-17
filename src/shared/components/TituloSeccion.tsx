interface Props {
  /** Línea pequeña en dorado sobre el título. */
  antetitulo?: string;
  titulo: string;
  /** Párrafo bajo el filete dorado. */
  descripcion?: string;
}

/** Encabezado de sección.
 *
 *  Existe para que todos los apartados se vean igual: antes cada sección
 *  llevaba su propio encabezado a mano y unos salían en 5xl y otros en un xs
 *  en mayúsculas, así que unos pesaban mucho más que otros. */
export default function TituloSeccion({ antetitulo, titulo, descripcion }: Props) {
  return (
    <div className="mb-14 text-center">
      {antetitulo && (
        <p
          className="text-xs font-bold uppercase tracking-[0.2em]"
          style={{ color: "#D4A827" }}
        >
          {antetitulo}
        </p>
      )}

      <h2
        className="mt-3 text-4xl font-black text-white md:text-5xl"
        style={{ letterSpacing: "-0.01em" }}
      >
        {titulo}
      </h2>

      <div className="mt-5 flex justify-center">
        <div
          className="h-px w-20"
          style={{ background: "linear-gradient(90deg, transparent, #D4A827, transparent)" }}
        />
      </div>

      {descripcion && (
        <p
          className="mx-auto mt-6 max-w-lg text-base leading-relaxed"
          style={{ color: "rgba(237,232,252,0.5)" }}
        >
          {descripcion}
        </p>
      )}
    </div>
  );
}
