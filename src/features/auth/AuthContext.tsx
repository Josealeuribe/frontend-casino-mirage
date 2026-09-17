import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  ApiError,
  cerrarSesion,
  fetchMe,
  getToken,
  loginUsuario,
  setToken as persistToken,
  type MeResult,
  type RegistroResult,
  type SafeBono,
} from "@/shared/api/client";

export type Role = "admin" | "cajero" | "cliente";

export interface SessionUser {
  kind: "staff" | "cliente";
  id: number;
  name: string;
  email: string;
  role: Role;
  sede: { clave: string; nombre: string; direccion: string } | null;
  debeCambiarPassword: boolean;
  bono?: SafeBono | null;
}

function toSessionUser(result: MeResult): SessionUser {
  if (result.tipo === "staff") {
    return {
      kind: "staff",
      id: result.staff.id,
      name: result.staff.nombre,
      email: result.staff.email,
      role: result.staff.rol,
      sede: result.staff.sede,
      debeCambiarPassword: result.staff.debeCambiarPassword,
    };
  }
  return {
    kind: "cliente",
    id: result.cliente.id,
    name: `${result.cliente.nombres} ${result.cliente.apellidos}`,
    email: result.cliente.email,
    role: "cliente",
    sede: null,
    debeCambiarPassword: false,
    bono: result.bono,
  };
}

interface AuthContextType {
  user: SessionUser | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<{ ok: boolean; error?: string; role?: Role }>;
  logout: () => void;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  /** El registro (POST /auth/register) ya devuelve un token de sesión igual
   *  que el login -- esto evita pedirle la contraseña otra vez justo después
   *  de que la escribió en el formulario. */
  setSessionFromRegistro: (result: RegistroResult) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Al cargar la app, si hay un token guardado se intenta recuperar la
  // sesion contra /auth/me. Si el token vencio o es invalido, se descarta en
  // silencio: es exactamente el mismo caso que "nunca inicio sesion".
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then((me) => setUser(toSessionUser(me)))
      .catch(() => persistToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      const result = await loginUsuario(identifier, password);
      persistToken(result.token);
      const me: MeResult =
        result.tipo === "staff"
          ? { tipo: "staff", staff: result.staff }
          : { tipo: "cliente", cliente: result.cliente, bono: result.bono, yaParticipo: result.yaParticipo, bonoCanjeado: result.bonoCanjeado };
      const sessionUser = toSessionUser(me);
      setUser(sessionUser);
      setIsLoginOpen(false);
      return { ok: true, role: sessionUser.role };
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "No se pudo iniciar sesión. Intenta de nuevo.";
      return { ok: false, error: message };
    }
  };

  const logout = () => {
    cerrarSesion().catch(() => {});
    persistToken(null);
    setUser(null);
  };

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const setSessionFromRegistro = (result: RegistroResult) => {
    persistToken(result.token);
    setUser(
      toSessionUser({
        tipo: "cliente",
        cliente: result.cliente,
        bono: result.bono,
        yaParticipo: result.yaParticipo,
        bonoCanjeado: result.bonoCanjeado,
      }),
    );
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isLoginOpen, openLogin, closeLogin, setSessionFromRegistro }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
