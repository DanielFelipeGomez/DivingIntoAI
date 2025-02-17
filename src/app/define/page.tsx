"use client";

import ChatInterface from "../components/chat-interface";
import TaskCard from "../components/target";
import { ChatProvider } from "../context/chat-context";

export default function DefinePage() {
  return (
    <ChatProvider>
      <ChatInterface>
        <TaskCard />
      </ChatInterface>
    </ChatProvider>
  );
}
