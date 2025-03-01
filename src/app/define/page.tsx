"use client";

import ChatInterface from "../components/chat-interface";
import TaskCard from "../components/task-card";

export default function DefinePage() {
  return (
    <ChatInterface>
      <TaskCard
        params={undefined}
        contextForModel={new Set()}
        setContextForModel={() => {}}
      />
    </ChatInterface>
  );
}
