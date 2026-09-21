import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import logoMirage from "@/imports/logo-mirage.png";

export interface ModuloDef {
  id: string;
  label: string;
  icon: ReactNode;
}

interface PanelSidebarProps {
  modules: ModuloDef[];
  active: string;
  onSelect: (mod: string) => void;
  roleLabel: string;
  /** Abierto como panel deslizante en móvil (por debajo de `md`). En
   *  escritorio el sidebar siempre está visible y estas dos props no
   *  importan. */
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

/** Sidebar compartido por los tres paneles internos (admin, cajero,
 *  cliente) -- antes era el mismo bloque de ~90 líneas repetido tal cual en
 *  cada uno de los tres `components/Sidebar.tsx`, con solo la lista de
 *  módulos y la etiqueta de rol cambiando. Se consolida aquí para no
 *  arreglar el mismo bug de responsividad en tres lugares distintos.
 *
 *  En escritorio (`md:` en adelante) es una columna fija de 224px, igual
 *  que antes. Por debajo de `md` se convierte en un panel que entra desde
 *  la izquierda -- oculto por defecto, cada Layout lo abre con un botón de
 *  hamburguesa en su topbar y lo pasa por `mobileOpen`. */
export default function PanelSidebar({ modules, active, onSelect, roleLabel, mobileOpen, onCloseMobile }: PanelSidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const seleccionar = (id: string) => {
    onSelect(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Fondo oscuro detrás del panel -- solo en móvil, y solo mientras
          está abierto. Tocarlo cierra el panel, igual que tocar afuera de
          cualquier drawer. */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(4,3,14,0.6)" }}
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`flex flex-col h-screen flex-shrink-0 fixed md:sticky top-0 left-0 z-50 md:z-auto transition-transform duration-200 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
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
          {modules.map((mod) => {
            const isActive = active === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => seleccionar(mod.id)}
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
              {user?.name?.[0] ?? roleLabel[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium truncate" style={{ color: "rgba(237,232,252,0.8)" }}>{user?.name ?? roleLabel}</p>
              <p className="text-xs truncate" style={{ color: "rgba(237,232,252,0.3)" }}>{roleLabel}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all duration-150"
            style={{ color: "rgba(237,232,252,0.35)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.65)"; e.currentTarget.style.background = "rgba(239,68,68,0.06)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(237,232,252,0.35)"; e.currentTarget.style.background = "transparent"; }}
          >
            <LogOut size={15} strokeWidth={1.4} />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
