import { createBrowserRouter } from "react-router";
import LandingPage from "@/features/landing/LandingPage";
import AdminLayout from "@/features/admin/AdminLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/admin",
    Component: AdminLayout,
  },
]);
