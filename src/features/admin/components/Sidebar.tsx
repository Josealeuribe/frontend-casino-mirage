import { useNavigate } from "react-router";
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
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1.5" y="10" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="10" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M1.5 12l4-5.5 3.5 3 4-6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1.5 15.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "clientes",
    label: "Clientes",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <circle cx="8.5" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 15c0-3.314 2.91-6 6.5-6s6.5 2.686 6.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "auditoria",
    label: "Auditoría de Canjes",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <rect x="2.5" y="1.5" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5.5 6.5h6M5.5 9.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "vigencias",
    label: "Vigencias",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8.5 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "campanas",
    label: "Campañas",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M8.5 2l2 5.5H16l-5 3.5 2 5.5-4.5-3.5L4 16.5l2-5.5-5-3.5h5.5L8.5 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "personal",
    label: "Personal",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <circle cx="5.5" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M1 15c0-2.761 2.015-5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="11.5" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 15c0-2.761-2.015-5-4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "mi-cuenta",
    label: "Mi Cuenta",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8.5" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 14.5a6 6 0 0111 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
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
        <img src={logoMirage} alt="Mirage Casino" className="h-11 w-auto object-contain" />
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
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M6 2.5H3a1 1 0 00-1 1v8a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M10 10l3.5-2.5L10 5M13.5 7.5H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
