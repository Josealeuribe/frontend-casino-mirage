import FAQSection from "../components/FAQSection";
import VolverInicio from "@/shared/components/VolverInicio";

/** Envoltorio delgado para la ruta "/faq". FAQSection no se reutiliza en
 *  ningun otro lado hoy, pero se mantiene el mismo patron que PremiosPage y
 *  ComoFuncionaPage por si en algun momento tambien se embebe en otra vista. */
export default function FaqPage() {
  return (
    <>
      <div className="px-4 pt-10">
        <div className="mx-auto max-w-2xl">
          <VolverInicio />
        </div>
      </div>

      <FAQSection />

      <div className="px-4 pb-28 text-center md:pb-40">
        <VolverInicio variante="boton" />
      </div>
    </>
  );
}
