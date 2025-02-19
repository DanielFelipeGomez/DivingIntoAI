/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useChat } from "ai/react";
import { Stock } from "./stock";
import { ReviewTarget } from "./review-target";
import TableData from "./table-data";
import { TextareaAutosize } from "@mui/material";
import { useRouter } from "next/navigation";

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

export default function ChatInterface({
  children,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
}) {
  const [params, setParams] = React.useState<ChatData>({
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

  const { messages, input, setInput, handleSubmit } = useChat({
    onError: (error) => {
      console.error("Error en el chat:", error);
    },
  });

  // Añadimos una referencia para evitar actualizaciones innecesarias
  const lastProcessedMessage = React.useRef("");

  React.useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      // Solo procesar si es un mensaje nuevo
      if (lastMessage.id !== lastProcessedMessage.current) {
        lastProcessedMessage.current = lastMessage.id;

        const targetDataMessage = messages
          .slice()
          .reverse()
          .find((message) =>
            message?.toolInvocations?.some(
              (tool) => tool.toolName === "getTargetData"
            )
          );

        if (targetDataMessage) {
          const tool = targetDataMessage.toolInvocations?.find(
            (tool) => tool.toolName === "getTargetData"
          );
          if (tool) {
            setParams(tool as unknown as ChatData);
          }
        }
      }
    }
  }, [messages, setParams]);

  const [isMenuCollapsed, setIsMenuCollapsed] = React.useState(false);
  // const [messages, setMessages] = React.useState<
  //   { text: string; sender: "ai" | "user" }[]
  // >([{ text: "I'll show you what you want", sender: "ai" }]);
  // const [input, setInput] = React.useState("");

  const menuItems = [
    { text: "review", route: "/review" },
    { text: "define", route: "/define" },
    { text: "analyze", route: "/analyze" },
    { text: "organize", route: "/organize" },
  ];

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(e);
  };

  const router = useRouter();

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div
        className={cn(
          "border-r p-4 flex flex-col gap-3 transition-all duration-300",
          isMenuCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          {!isMenuCollapsed && (
            <span className="text-sm text-muted-foreground">menu</span>
          )}
        </div>
        {menuItems.map((item) => (
          <Button
            key={item.text}
            variant="outline"
            className={cn(
              "w-full justify-start normal-case text-base",
              isMenuCollapsed && "px-2"
            )}
            onClick={() => router.push(item.route)}
          >
            {isMenuCollapsed ? item.text.charAt(0).toUpperCase() : item.text}
          </Button>
        ))}
      </div>

      {/* Middle Content Area */}
      <div className="flex-1 border-r p-4">
        {React.isValidElement(children) &&
          React.cloneElement<any>(children, { params })}
      </div>

      {/* Chat Area */}
      <div className="w-[400px] flex flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center gap-2">
            <span>Ask AI</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start gap-2">
                {message.role !== "user" ? (
                  !message.toolInvocations ? (
                    <Card className="p-3 bg-muted">{message.content}</Card>
                  ) : (
                    <>
                      <div className="h-6 w-6 rounded-full bg-pink-200 flex-shrink-0" />
                      <span className="font-medium mr-2">AI</span>

                      <div>
                        {message.toolInvocations?.map((toolInvocation) => {
                          const { toolName, toolCallId, state } =
                            toolInvocation;

                          if (state === "result") {
                            if (toolName === "getStockPrice") {
                              const { result } = toolInvocation;
                              return <Stock key={toolCallId} {...result} />;
                            } else if (toolName === "codeLint") {
                              const { result } = toolInvocation;
                              return (
                                <ReviewTarget key={toolCallId} {...result} />
                              );
                            } else if (toolName === "getMockTableData") {
                              const { result } = toolInvocation;
                              return <TableData key={toolCallId} {...result} />;
                            }
                          } else {
                            return (
                              <div key={toolCallId}>
                                {toolName === "displayWeather" ? (
                                  <div>Loading weather...</div>
                                ) : toolName === "codeLint" ? (
                                  <div>Loading review code...</div>
                                ) : toolName === "getMockTableData" ? (
                                  <div>Loading table data...</div>
                                ) : (
                                  <div>Loading...</div>
                                )}
                              </div>
                            );
                          }
                        })}
                      </div>
                    </>
                  )
                ) : (
                  <div className="flex items-start gap-2 ml-auto">
                    <Card className="p-3 bg-blue-500 text-white">
                      {message.content}
                    </Card>
                    <span className="font-medium mr-2">{message.role}</span>
                    <div className="h-6 w-6 rounded-full bg-pink-200 flex-shrink-0" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <form onSubmit={handleChatSubmit} className="border-t p-4 flex gap-2">
          <TextareaAutosize
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write what you want..."
            className="flex-1"
          />
          <Button type="submit" size="icon" variant="ghost">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
