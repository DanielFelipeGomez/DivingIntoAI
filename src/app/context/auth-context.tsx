"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  // const pathname = usePathname();

  // Verificar si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      // Obtener la sesión actual
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setUser(currentSession?.user || null);
      setIsAuthenticated(!!currentSession);

      // Escuchar cambios en la autenticación
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setUser(newSession?.user || null);
        setIsAuthenticated(!!newSession);
      });

      return () => {
        subscription.unsubscribe();
      };
    };

    checkAuth();
  }, []);

  // Proteger rutas cuando el usuario no está autenticado
  // useEffect(() => {
  //   if (!isAuthenticated && pathname !== "/" && pathname !== "/login") {
  //     router.push("/");
  //   }
  // }, [isAuthenticated, pathname, router]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Error de autenticación:", error.message);
        return false;
      }

      return !!data.session;
    } catch (error) {
      console.error("Error de autenticación:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error al cerrar sesión:", error.message);
      }
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
