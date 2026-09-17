import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "@/shared/components/Footer";
import LoginModal from "@/features/auth/LoginModal";
import { useAuth } from "@/features/auth/AuthContext";
import { useTituloVista } from "@/shared/hooks/useTituloVista";
import { NAV_LINKS } from "./navigation";
import fondoArauca from "@/imports/imagen-fondo-arauca.jpg";

/** Marco comun de todas las vistas publicas: fondo, navbar y footer. Lo que
 *  cambia entre una opcion del navbar y otra es solo el <Outlet>. */
export default function LandingLayout() {
  const { isLoginOpen } = useAuth();
  const { pathname } = useLocation();

  // El nombre de la pestaña sale de la misma lista que el navbar, asi que una
  // vista nueva se titula sola. `pathname` ya viene sin el basename, asi que
  // esto sigue cuadrando cuando el sitio se sirve bajo /arauca.
  const vista = NAV_LINKS.find((l) => l.to === pathname);
  useTituloVista(vista?.label);

  // Al cambiar de vista hay que volver arriba: el router conserva el scroll
  // y, viniendo de una vista larga, la nueva se abriria por la mitad.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="relative" style={{ background: "#080718", minHeight: "100vh" }}>
      {/* Fondo de todas las vistas publicas. Va aqui y no en cada seccion para
          que la imagen se lea plana y continua, sin recuadros: las vistas no
          pintan fondo propio, solo el footer.

          Es un <div> fixed y no background-attachment:fixed porque esa
          propiedad va a tirones -- o se ignora -- en Safari iOS.

          El panel de admin no monta este layout, asi que conserva su fondo
          plano. */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={fondoArauca}
          alt=""
          aria-hidden="true"
          // scale-110: el blur muestrea fuera del borde y dejaria los cantos
          // semitransparentes; agrandando la imagen ese halo cae fuera del
          // viewport. El brightness es el que hace legible el texto encima.
          className="h-full w-full scale-110 object-cover"
          style={{ filter: "blur(3px) brightness(0.28) saturate(0.7)" }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(8,7,24,0.55)" }} />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        {/* El navbar es fixed, asi que sin este hueco la vista arrancaria
            debajo de el. flex-1 empuja el footer al fondo en las vistas
            cortas, como Sedes. */}
        <main className="flex-1 pt-[var(--nav-h)]">
          <Outlet />
        </main>
        <Footer />
      </div>

      {isLoginOpen && <LoginModal />}
    </div>
  );
}
