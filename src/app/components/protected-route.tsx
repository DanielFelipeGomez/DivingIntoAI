"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Si no está autenticado, no renderizamos nada (o podríamos mostrar un spinner de carga)
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Acceso Restringido</h2>
          <p className="text-gray-600">
            Redirigiendo a la página de inicio de sesión...
          </p>
        </div>
      </div>
    );
  }

  // Si está autenticado, renderizamos el contenido protegido
  return <>{children}</>;
}
