import { createBrowserRouter } from "react-router";
import LandingLayout from "@/features/landing/LandingLayout";
import GiraYGanaPage from "@/features/landing/pages/GiraYGanaPage";
import RuletaPage from "@/features/landing/pages/RuletaPage";
import InicioPage from "@/features/landing/pages/InicioPage";
import SedesPage from "@/features/landing/pages/SedesPage";
import PremiosPage from "@/features/landing/pages/PremiosPage";
import ComoFuncionaPage from "@/features/landing/pages/ComoFuncionaPage";
import FaqPage from "@/features/landing/pages/FaqPage";
import TerminosCondiciones from "@/features/legal/pages/TerminosCondiciones";
import PoliticaPrivacidad from "@/features/legal/pages/PoliticaPrivacidad";
import TratamientoDatos from "@/features/legal/pages/TratamientoDatos";
import JuegoResponsable from "@/features/legal/pages/JuegoResponsable";
import CondicionesPromocion from "@/features/legal/pages/CondicionesPromocion";
import RegistrationPage from "@/features/registration/RegistrationPage";
import AdminLayout from "@/features/admin/AdminLayout";
import CajeroLayout from "@/features/cajero/CajeroLayout";
import ClienteLayout from "@/features/cliente/ClienteLayout";
import RouteErrorBoundary from "@/shared/components/RouteErrorBoundary";

export const router = createBrowserRouter(
  [
    {
      // Todas las vistas publicas cuelgan del mismo marco (fondo, navbar y
      // footer); lo unico que cambia entre opciones del navbar es el hijo.
      // ErrorBoundary propio: si algo revienta al renderizar CUALQUIER hijo
      // (p.ej. el choque traductor-vs-React en /jugar), quien visita ve un
      // aviso en español con boton de recargar, no la pagina generica de
      // React Router en ingles con el stack trace crudo.
      path: "/",
      Component: LandingLayout,
      ErrorBoundary: RouteErrorBoundary,
      children: [
        // Punto de entrada: quien abre el sitio ve "Gira y Gana", que ahora
        // solo informa (premios + como funciona + un boton). La ruleta que
        // realmente gira vive en "/jugar", aparte y sin distracciones.
        { index: true, Component: GiraYGanaPage },
        { path: "jugar", Component: RuletaPage },
        { path: "inicio", Component: InicioPage },
        // Estas tres cuelgan de envoltorios delgados (PremiosPage,
        // ComoFuncionaPage, FaqPage) que solo agregan el enlace "Volver al
        // inicio" alrededor del componente compartido -- ese enlace no puede
        // vivir dentro de PrizesSection/HowItWorksSection/FAQSection porque
        // esos mismos componentes tambien se embeben en GiraYGanaPage, donde
        // el enlace no pintaria nada a mitad de pagina.
        { path: "premios", Component: PremiosPage },
        { path: "como-funciona", Component: ComoFuncionaPage },
        { path: "sedes", Component: SedesPage },
        { path: "faq", Component: FaqPage },
        // El registro cuelga del mismo layout publico (fondo, navbar, footer):
        // se llega aqui desde el modal de premio de "/jugar" o desde "Ya
        // tengo cuenta", nunca es una vista aislada.
        { path: "registro", Component: RegistrationPage },
        // Las 5 opciones de la columna "Legal" del footer. No cuelgan del
        // navbar -- solo el footer enlaza aqui -- pero comparten el mismo
        // layout publico (fondo, navbar, footer) para no romper la navegacion.
        { path: "legal/terminos-y-condiciones", Component: TerminosCondiciones },
        { path: "legal/politica-de-privacidad", Component: PoliticaPrivacidad },
        { path: "legal/tratamiento-de-datos", Component: TratamientoDatos },
        { path: "legal/juego-responsable", Component: JuegoResponsable },
        { path: "legal/condiciones-promocion", Component: CondicionesPromocion },
      ],
    },
    {
      // Fuera del layout publico: el panel tiene su propio marco y su fondo
      // plano, sin la imagen del casino.
      path: "/admin",
      Component: AdminLayout,
      ErrorBoundary: RouteErrorBoundary,
    },
    {
      // El panel del cajero -- mostrador de caja, busca y confirma canjes.
      // Mismo criterio que /admin: marco propio, sin el layout publico.
      path: "/cajero",
      Component: CajeroLayout,
      ErrorBoundary: RouteErrorBoundary,
    },
    {
      // Cuenta del cliente: su bono, el codigo y donde redimirlo. Mismo
      // criterio que /admin y /cajero -- marco propio, sin el layout
      // publico (fondo del casino, navbar de navegacion general).
      path: "/cuenta",
      Component: ClienteLayout,
      ErrorBoundary: RouteErrorBoundary,
    },
  ],
  {
    // Sirve la app bajo un subpath (p.ej. /arauca) detras del Nginx
    // compartido de innovaclub.com.co. import.meta.env.BASE_URL ya refleja
    // el `base` fijado en vite.config.ts (via FIGMA_PUBLIC_URL al construir),
    // asi que basename queda siempre en sincronia con el build, sin
    // duplicar el valor a mano.
    basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/",
  },
);
