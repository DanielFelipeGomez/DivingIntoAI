"use client";

import * as React from "react";
import { Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ChatInterface({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuCollapsed, setIsMenuCollapsed] = React.useState(false);
  const [messages, setMessages] = React.useState<
    { text: string; sender: "ai" | "user" }[]
  >([{ text: "I'll show you what you want", sender: "ai" }]);
  const [input, setInput] = React.useState("");

  const menuItems = [
    { text: "review", onClick: () => {} },
    { text: "define", onClick: () => {} },
    { text: "analyze", onClick: () => {} },
    { text: "organize my day", onClick: () => {} },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
    }
  };

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
            onClick={item.onClick}
          >
            {isMenuCollapsed ? item.text.charAt(0).toUpperCase() : item.text}
          </Button>
        ))}
      </div>

      {/* Middle Content Area */}
      <div className="flex-1 border-r p-4">{children}</div>

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
            {messages.map((message, index) => (
              <div key={index} className="flex items-start gap-2">
                {message.sender === "ai" ? (
                  <>
                    <div className="h-6 w-6 rounded-full bg-pink-200 flex-shrink-0" />
                    <span className="font-medium mr-2">AI</span>
                    <Card className="p-3 bg-muted">{message.text}</Card>
                  </>
                ) : (
                  <div className="flex items-start gap-2 ml-auto">
                    <Card className="p-3 bg-blue-500 text-white">
                      {message.text}
                    </Card>
                    <span className="font-medium mr-2">Me</span>
                    <div className="h-6 w-6 rounded-full bg-pink-200 flex-shrink-0" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="border-t p-4 flex gap-2">
          <Input
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
