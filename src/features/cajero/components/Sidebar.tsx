import { Gift, IdCard, History, CalendarClock, UserCircle } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import PanelSidebar, { type ModuloDef } from "@/shared/components/PanelSidebar";

export type ModuleDef = ModuloDef;

// Mismos 5 módulos del mostrador de caja de siempre -- solo cambió cómo se
// pinta el sidebar (ver PanelSidebar.tsx), no la lista.
export const MODULES: ModuleDef[] = [
  {
    id: "canjear-codigo",
    label: "Canjear Código",
    icon: <Gift size={17} />,
  },
  {
    id: "buscar-cedula",
    label: "Buscar por Cédula",
    icon: <IdCard size={17} />,
  },
  {
    id: "mis-canjes",
    label: "Mis Canjes",
    icon: <History size={17} />,
  },
  {
    id: "vigencias",
    label: "Vigencias",
    icon: <CalendarClock size={17} />,
  },
  {
    id: "mi-cuenta",
    label: "Mi Cuenta",
    icon: <UserCircle size={17} />,
  },
];

interface SidebarProps {
  active: string;
  onSelect: (mod: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ active, onSelect, mobileOpen, onCloseMobile }: SidebarProps) {
  const { user } = useAuth();
  // El backend deja entrar tanto a "cajero" como a "admin" a este mostrador
  // (un admin también puede atender caja), así que la etiqueta se ajusta al
  // rol real de la sesión en vez de asumir siempre "Cajero".
  const roleLabel = user?.role === "admin" ? "Administrador" : "Cajero";

  return (
    <PanelSidebar
      modules={MODULES}
      active={active}
      onSelect={onSelect}
      roleLabel={roleLabel}
      mobileOpen={mobileOpen}
      onCloseMobile={onCloseMobile}
    />
  );
}
