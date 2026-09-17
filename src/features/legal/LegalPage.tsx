import type { ReactNode } from "react";
import VolverInicio from "@/shared/components/VolverInicio";

interface Props {
  antetitulo: string;
  titulo: string;
  actualizado: string;
  children: ReactNode;
}

/** Marco común de las cinco páginas legales del footer.
 *
 *  Todas comparten título, fecha de vigencia y el botón "Volver al inicio" --
 *  aquí y no repetido cinco veces, para que ese botón se comporte igual en
 *  todas si algún día cambia. */
export default function LegalPage({ antetitulo, titulo, actualizado, children }: Props) {
  return (
    <section className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <VolverInicio />
        </div>

        <p
          className="text-xs font-bold uppercase tracking-[0.2em]"
          style={{ color: "#D4A827" }}
        >
          {antetitulo}
        </p>
        <h1
          className="mt-3 text-3xl font-black text-white md:text-4xl"
          style={{ letterSpacing: "-0.01em" }}
        >
          {titulo}
        </h1>
        <p className="mt-3 text-sm" style={{ color: "rgba(237,232,252,0.4)" }}>
          Última actualización: {actualizado}
        </p>

        <div
          className="mt-10 rounded-3xl p-6 md:p-10"
          style={{
            background: "rgba(14,11,40,0.8)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Contenido legal: prosa larga, así que interlineado holgado y
              jerarquía marcada por tamaño en vez de por color, que ya está
              ocupado por los acentos del sitio. */}
          <div className="legal-prosa" style={{ color: "rgba(237,232,252,0.75)" }}>
            {children}
          </div>
        </div>

        <div className="mt-10 text-center">
          <VolverInicio variante="boton" />
        </div>
      </div>
    </section>
  );
}
