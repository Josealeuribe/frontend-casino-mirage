import PrizesSection from "../components/PrizesSection";
import VolverInicio from "@/shared/components/VolverInicio";

/** Envoltorio delgado para la ruta "/premios".
 *
 *  PrizesSection es el mismo componente que Gira y Gana ya embebe en su
 *  vista de informacion; el enlace "Volver al inicio" va aqui, en el
 *  envoltorio de la ruta, y no dentro de PrizesSection -- si viviera ahi
 *  apareceria tambien a mitad de la pagina de Gira y Gana, entre el hero y
 *  Como Funciona, donde no pinta nada. */
export default function PremiosPage() {
  return (
    <>
      <div className="px-4 pt-10">
        <div className="mx-auto max-w-6xl">
          <VolverInicio />
        </div>
      </div>

      <PrizesSection />

      <div className="px-4 pb-28 text-center md:pb-40">
        <VolverInicio variante="boton" />
      </div>
    </>
  );
}
