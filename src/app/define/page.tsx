"use client";

import { Button } from "@/components/ui/button";
import ChatInterface from "../components/chat-interface";
import ProtectedRoute from "../components/protected-route";
import TaskCard from "../components/task-card";
import { useAuth } from "../context/auth-context";

export default function DefinePage() {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-xl font-semibold">DivingIntoAI</h1>
          <Button variant="outline" onClick={logout}>
            Cerrar Sesión
          </Button>
        </header>
        <main className="flex-1">
          <ChatInterface>
            <TaskCard
              params={undefined}
              contextForModel={new Set()}
              setContextForModel={() => {}}
            />
          </ChatInterface>
        </main>
      </div>
    </ProtectedRoute>
  );
}
