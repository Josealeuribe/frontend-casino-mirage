import { ChevronLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router";

interface Props {
  /** "enlace": link discreto con flecha, dorado -- para el encabezado de la
   *  vista. "boton": pastilla llena, para cerrar la vista. Mismo tratamiento
   *  que ya usa LegalPage en las cinco paginas del footer. */
  variante?: "enlace" | "boton";
  className?: string;
  /** Se dispara ademas de navegar -- lo usa LoginModal para cerrarse a si
   *  mismo: al ser un modal global montado en LandingLayout, navegar solo
   *  con el Link no lo desmonta (LandingLayout persiste entre rutas), asi
   *  que sin esto quedaria abierto encima de la pagina de destino. */
  onNavigate?: () => void;
}

const flecha = <ChevronLeft size={16} strokeWidth={1.7} />;

/** "Volver al inicio", con el mismo aspecto en cualquier vista publica que lo
 *  use. Nace de LegalPage -- las cinco paginas del footer ya lo llevaban --
 *  para no repetir el mismo markup en Gira y Gana, Premios, Cómo Funciona,
 *  Sedes y FAQ. La vista de Inicio no lo usa: no tiene sentido volver a donde
 *  ya se esta.
 *
 *  Casos especiales, via `?from=` en la URL: quien enlaza a una pagina legal
 *  desde un contexto donde "volver al inicio" no tiene sentido le agrega ese
 *  parametro para que este boton vuelva a donde de verdad se estaba.
 *
 *  - `from=registro`: los enlaces "ver" de los terminos dentro del formulario
 *    de registro. Toda la navegacion del sitio vuelve dentro de la MISMA
 *    pestaña (nunca se abren ventanas/pestañas nuevas para moverse dentro
 *    del propio aplicativo), asi que ir a leer los terminos remonta
 *    RegistrationPage desde cero -- el query param es lo unico que sobrevive
 *    a ese remontaje para saber a donde volver (el formulario en si se
 *    recupera aparte, desde sessionStorage, ver RegistrationPage.tsx).
 *  - `from=ruleta`: el enlace "Ver terminos" de la vista de la ruleta
 *    funcional. Ahi "volver al inicio" mandaria a la vista de informacion
 *    general, perdiendo los giros/animo de quien ya estaba a punto de girar
 *    -- debe volver a "/jugar", no a "/inicio". */
const DESTINOS: Record<string, { to: string; texto: string }> = {
  registro: { to: "/registro", texto: "Volver al formulario" },
  ruleta: { to: "/jugar", texto: "Volver a la ruleta" },
};

export default function VolverInicio({ variante = "enlace", className = "", onNavigate }: Props) {
  const [params] = useSearchParams();
  const { to, texto } = DESTINOS[params.get("from") ?? ""] ?? { to: "/inicio", texto: "Volver al inicio" };

  if (variante === "boton") {
    return (
      <Link
        to={to}
        onClick={onNavigate}
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
      onClick={onNavigate}
      className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${className}`}
      style={{ color: "#D4A827" }}
    >
      {flecha}
      {texto}
    </Link>
  );
}
