import { Link } from "react-router";

interface Props {
  /** "enlace": link discreto con flecha, dorado -- para el encabezado de la
   *  vista. "boton": pastilla llena, para cerrar la vista. Mismo tratamiento
   *  que ya usa LegalPage en las cinco paginas del footer. */
  variante?: "enlace" | "boton";
  className?: string;
}

const flecha = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** "Volver al inicio", con el mismo aspecto en cualquier vista publica que lo
 *  use. Nace de LegalPage -- las cinco paginas del footer ya lo llevaban --
 *  para no repetir el mismo markup en Gira y Gana, Premios, Cómo Funciona,
 *  Sedes y FAQ. La vista de Inicio no lo usa: no tiene sentido volver a donde
 *  ya se esta. */
export default function VolverInicio({ variante = "enlace", className = "" }: Props) {
  if (variante === "boton") {
    return (
      <Link
        to="/inicio"
        className={`inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 ${className}`}
        style={{
          background: "linear-gradient(135deg, #6B32D6 0%, #1A5ED8 100%)",
          boxShadow: "0 6px 28px rgba(107,50,214,0.4)",
        }}
      >
        {flecha}
        Volver al inicio
      </Link>
    );
  }

  return (
    <Link
      to="/inicio"
      className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${className}`}
      style={{ color: "#D4A827" }}
    >
      {flecha}
      Volver al inicio
    </Link>
  );
}
