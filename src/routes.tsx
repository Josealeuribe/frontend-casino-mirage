import { createBrowserRouter } from "react-router";
import LandingPage from "@/features/landing/LandingPage";
import AdminLayout from "@/features/admin/AdminLayout";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: LandingPage,
    },
    {
      path: "/admin",
      Component: AdminLayout,
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
