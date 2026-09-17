import { ChevronLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router";

interface Props {
  /** "enlace": link discreto con flecha, dorado -- para el encabezado de la
   *  vista. "boton": pastilla llena, para cerrar la vista. Mismo tratamiento
   *  que ya usa LegalPage en las cinco paginas del footer. */
  variante?: "enlace" | "boton";
  className?: string;
}

const flecha = <ChevronLeft size={16} strokeWidth={1.7} />;

/** "Volver al inicio", con el mismo aspecto en cualquier vista publica que lo
 *  use. Nace de LegalPage -- las cinco paginas del footer ya lo llevaban --
 *  para no repetir el mismo markup en Gira y Gana, Premios, Cómo Funciona,
 *  Sedes y FAQ. La vista de Inicio no lo usa: no tiene sentido volver a donde
 *  ya se esta.
 *
 *  Caso especial: los enlaces "ver" de los terminos legales dentro del
 *  formulario de registro abren la pagina legal en una pestaña NUEVA (para
 *  no perder lo que el cliente ya escribio) con `?from=registro` en la URL.
 *  Como es una pestaña nueva (target="_blank"), no hay forma de pasar el
 *  origen por el estado de React Router -- solo sobrevive un query param en
 *  la URL misma. Si esta presente, este boton vuelve al formulario en vez de
 *  al inicio: no tiene sentido mandar a quien esta llenando un registro de
 *  vuelta a la portada. */
export default function VolverInicio({ variante = "enlace", className = "" }: Props) {
  const [params] = useSearchParams();
  const vieneDelRegistro = params.get("from") === "registro";
  const to = vieneDelRegistro ? "/registro" : "/inicio";
  const texto = vieneDelRegistro ? "Volver al formulario" : "Volver al inicio";

  if (variante === "boton") {
    return (
      <Link
        to={to}
        className={`inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 ${className}`}
        style={{
          background: "linear-gradient(135deg, #6B32D6 0%, #1A5ED8 100%)",
          boxShadow: "0 6px 28px rgba(107,50,214,0.4)",
        }}
      >
        {flecha}
        {texto}
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${className}`}
      style={{ color: "#D4A827" }}
    >
      {flecha}
      {texto}
    </Link>
  );
}
