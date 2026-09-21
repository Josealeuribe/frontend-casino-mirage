import {
  LayoutGrid,
  BarChart3,
  Users,
  ClipboardList,
  Clock,
  Megaphone,
  UserCog,
  UserCircle,
} from "lucide-react";
import PanelSidebar, { type ModuloDef } from "@/shared/components/PanelSidebar";

export type ModuleDef = ModuloDef;

export const MODULES: ModuleDef[] = [
  {
    id: "vista-general",
    label: "Vista General",
    icon: <LayoutGrid size={17} />,
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <BarChart3 size={17} />,
  },
  {
    id: "clientes",
    label: "Clientes",
    icon: <Users size={17} />,
  },
  {
    id: "auditoria",
    label: "Auditoría de Canjes",
    icon: <ClipboardList size={17} />,
  },
  {
    id: "vigencias",
    label: "Vigencias",
    icon: <Clock size={17} />,
  },
  {
    id: "campanas",
    label: "Campañas",
    icon: <Megaphone size={17} />,
  },
  {
    id: "personal",
    label: "Personal",
    icon: <UserCog size={17} />,
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
  return (
    <PanelSidebar
      modules={MODULES}
      active={active}
      onSelect={onSelect}
      roleLabel="Administrador"
      mobileOpen={mobileOpen}
      onCloseMobile={onCloseMobile}
    />
  );
}
