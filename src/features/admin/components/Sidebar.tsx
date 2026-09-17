import { useNavigate } from "react-router";
import {
  LayoutGrid,
  BarChart3,
  Users,
  ClipboardList,
  Clock,
  Megaphone,
  UserCog,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import logoMirage from "@/imports/logo-mirage.png";

export interface ModuleDef {
  id: string;
  label: string;
  icon: React.ReactNode;
}

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
}

export default function Sidebar({ active, onSelect }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 flex-shrink-0"
      style={{
        width: 224,
        background: "#0C0924",
        borderRight: "1px solid rgba(107,50,214,0.14)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-center py-5 px-4"
        style={{ borderBottom: "1px solid rgba(107,50,214,0.1)" }}
      >
        <img src={logoMirage} alt="Centro Club Mirage" className="h-11 w-auto object-contain" />
      </div>

      {/* Module nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
        {MODULES.map((mod) => {
          const isActive = active === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => onSelect(mod.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all duration-150"
              style={{
                background: isActive
                  ? "linear-gradient(90deg, rgba(107,50,214,0.2) 0%, rgba(26,94,216,0.12) 100%)"
                  : "transparent",
                color: isActive ? "#C4B5FD" : "rgba(237,232,252,0.45)",
                border: isActive ? "1px solid rgba(107,50,214,0.28)" : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "rgba(237,232,252,0.8)";
                  e.currentTarget.style.background = "rgba(107,50,214,0.07)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "rgba(237,232,252,0.45)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span style={{ color: isActive ? "#8B5CE8" : "rgba(237,232,252,0.3)", flexShrink: 0 }}>
                {mod.icon}
              </span>
              <span className="truncate text-xs">{mod.label}</span>
              {isActive && (
                <span className="ml-auto w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#8B5CE8" }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="p-3" style={{ borderTop: "1px solid rgba(107,50,214,0.1)" }}>
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1 rounded-xl" style={{ background: "rgba(107,50,214,0.06)" }}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#6B32D6,#1A5ED8)", color: "#fff" }}
          >
            {user?.name?.[0] ?? "A"}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium truncate" style={{ color: "rgba(237,232,252,0.8)" }}>{user?.name ?? "Admin"}</p>
            <p className="text-xs truncate" style={{ color: "rgba(237,232,252,0.3)" }}>Administrador</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all duration-150"
          style={{ color: "rgba(237,232,252,0.35)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.65)"; e.currentTarget.style.background = "rgba(239,68,68,0.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.35)"; e.currentTarget.style.background = "transparent"; }}
        >
          <LogOut size={15} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
