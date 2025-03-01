"use client";

import ChatInterface from "../../components/chat-interface";
import CodeReview from "../../components/code-review";
import ProtectedRoute from "../../components/protected-route";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/auth-context";

export default function ReviewCodePage() {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-xl font-semibold">Code Review</h1>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </header>
        <main className="flex-1">
          <ChatInterface>
            <CodeReview params={undefined} />
          </ChatInterface>
        </main>
      </div>
    </ProtectedRoute>
  );
}
