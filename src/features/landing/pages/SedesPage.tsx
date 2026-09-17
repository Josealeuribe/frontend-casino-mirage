import MapaSedes from "@/shared/components/MapaSedes";
import VolverInicio from "@/shared/components/VolverInicio";
import { SEDES } from "@/shared/data/sedes";

export default function SedesPage() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <VolverInicio />
        </div>

        <div className="mb-12 text-center">
          <span
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em]"
            style={{
              color: "#D4A827",
              background: "rgba(212,168,39,0.1)",
              border: "1px solid rgba(212,168,39,0.22)",
            }}
          >
            {SEDES.length} sedes en Arauca
          </span>
          <h1
            className="mt-5 mb-4 text-4xl font-black text-white md:text-5xl"
            style={{ letterSpacing: "-0.01em" }}
          >
            ¿Dónde estamos?
          </h1>
          <p className="mx-auto max-w-md text-base" style={{ color: "rgba(237,232,252,0.5)" }}>
            Tu bono se redime presencialmente. Encuéntranos en nuestras dos sedes de Arauca.
          </p>
        </div>

        {/* Mismo componente que usa la vista de Inicio: una sola presentación
            de las sedes, sin dos diseños que se desincronicen. */}
        <MapaSedes />

        <div className="mt-16 text-center">
          <VolverInicio variante="boton" />
        </div>
      </div>
    </section>
  );
}
