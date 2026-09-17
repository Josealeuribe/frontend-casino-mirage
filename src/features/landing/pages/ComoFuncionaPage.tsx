import HowItWorksSection from "../components/HowItWorksSection";
import VolverInicio from "@/shared/components/VolverInicio";

/** Envoltorio delgado para la ruta "/como-funciona". Mismo motivo que
 *  PremiosPage: el enlace vive en la ruta, no dentro del componente
 *  compartido, porque HowItWorksSection tambien se embebe en Gira y Gana. */
export default function ComoFuncionaPage() {
  return (
    <>
      <div className="px-4 pt-10">
        <div className="mx-auto max-w-5xl">
          <VolverInicio />
        </div>
      </div>

      <HowItWorksSection />

      <div className="px-4 pb-28 text-center md:pb-40">
        <VolverInicio variante="boton" />
      </div>
    </>
  );
}
