import { Gift, History, Home, MapPin, Trophy, UserCircle } from "lucide-react";
import PanelSidebar, { type ModuloDef } from "@/shared/components/PanelSidebar";

export type ModuleDef = ModuloDef;

/** Mismos 6 módulos pedidos por el dueño del proyecto, adaptados del sidebar
 *  de referencia (Inicio, Mis Bonos, Mis Bingos, Mis Premios, Historial, Mi
 *  Perfil): este producto no tiene bingos, así que ese lugar lo ocupa
 *  "Sedes" -- que es justo el dato que se pidió que el cliente pudiera
 *  encontrar (dónde redimir su bono). */
export const MODULES: ModuleDef[] = [
  {
    id: "inicio",
    label: "Inicio",
    icon: <Home size={17} strokeWidth={1.5} />,
  },
  {
    id: "mi-bono",
    label: "Mi Bono",
    icon: <Gift size={17} strokeWidth={1.5} />,
  },
  {
    id: "premios",
    label: "Premios",
    icon: <Trophy size={17} strokeWidth={1.5} />,
  },
  {
    id: "sedes",
    label: "Sedes",
    icon: <MapPin size={17} strokeWidth={1.5} />,
  },
  {
    id: "historial",
    label: "Historial",
    icon: <History size={17} strokeWidth={1.5} />,
  },
  {
    id: "mi-perfil",
    label: "Mi Perfil",
    icon: <UserCircle size={17} strokeWidth={1.5} />,
  },
];

interface SidebarProps {
  active: string;
  onSelect: (mod: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ active, onSelect, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <PanelSidebar
      modules={MODULES}
      active={active}
      onSelect={onSelect}
      roleLabel="Cliente"
      mobileOpen={mobileOpen}
      onCloseMobile={onCloseMobile}
    />
  );
}
