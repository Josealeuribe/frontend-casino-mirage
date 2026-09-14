import { createContext, useContext, useState, type ReactNode } from "react";

interface User {
  name: string;
  role: "admin";
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const login = (username: string, password: string) => {
    if (username === "admin" && password === "admin123") {
      setUser({ name: "José", role: "admin" });
      setIsLoginOpen(false);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);
  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoginOpen, openLogin, closeLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
