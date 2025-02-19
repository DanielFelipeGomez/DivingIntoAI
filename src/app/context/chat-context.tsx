import { createContext, useContext, useState, ReactNode } from "react";

export interface ChatData {
  result: {
    title: string;
    description: string;
    requirements: string;
    reproductionSteps: string;
    limitDate: string;
    priority: string;
    labels: string[];
  };
}

interface ChatContextType {
  chatData: ChatData;
  updateChatData: (data: ChatData) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chatData, setChatData] = useState<ChatData>({
    result: {
      title: "",
      description: "",
      requirements: "",
      reproductionSteps: "",
      limitDate: "",
      priority: "",
      labels: [],
    },
  });

  const updateChatData = (data: ChatData) => {
    setChatData(data);
  };

  return (
    <ChatContext.Provider value={{ chatData, updateChatData }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext debe usarse dentro de un ChatProvider");
  }
  return context;
}
