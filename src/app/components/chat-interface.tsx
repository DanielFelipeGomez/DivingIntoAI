/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  Menu,
  Search,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  FileEdit,
  FileSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useChat } from "ai/react";
import { Stock } from "./stock";
import TableData from "./table-data";
import { TextareaAutosize } from "@mui/material";
import { useRouter } from "next/navigation";
import { CodeReviewProps } from "./code-review";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";

const CodeBlock = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const codeRef = React.useRef<HTMLElement>(null);

  const copyToClipboard = () => {
    if (codeRef.current) {
      const text = codeRef.current.textContent || "";
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="relative group">
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 group-hover:text-gray-500 hover:text-black hover:bg-gray-200/80 transition-all"
        onClick={copyToClipboard}
      >
        {isCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      <pre className={cn("bg-slate-400 rounded-lg p-4", className)}>
        <code ref={codeRef} className={className}>
          {children}
        </code>
      </pre>
    </div>
  );
};

export interface ChatData {
  title: string;
  description: string;
  requirements: string;
  reproductionSteps: string;
  limitDate: string;
  priority: string;
  labels: string[];
}

export default function ChatInterface({
  children,
}: {
  children: React.ReactElement<any>;
}) {
  const [params, setParams] = React.useState<
    ChatData | CodeReviewProps | undefined
  >(undefined);
  const [chatWidth, setChatWidth] = React.useState(400);
  const [isResizing, setIsResizing] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const { messages, input, setInput, handleSubmit } = useChat({
    onResponse: (response) => {
      console.log("response", response);
    },
    onError: (error) => {
      console.error("Error en el chat:", error);
    },
  });

  // Añadimos una referencia para evitar actualizaciones innecesarias
  const lastProcessedMessage = React.useRef("");

  React.useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.id !== lastProcessedMessage.current) {
        lastProcessedMessage.current = lastMessage.id;

        const targetDataMessage = messages
          .slice()
          .reverse()
          .find((message) =>
            message?.toolInvocations?.some(
              (tool) =>
                tool.toolName === "getTargetData" && tool.state === "result"
            )
          );

        const codeReviewMessage = messages
          .slice()
          .reverse()
          .find((message) =>
            message?.toolInvocations?.some(
              (tool) =>
                tool.toolName === "getCodeReviewData" && tool.state === "result"
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

        if (codeReviewMessage) {
          const tool = codeReviewMessage.toolInvocations?.find(
            (tool) => tool.toolName === "getCodeReviewData"
          );
          if (tool) {
            console.log("tool", tool);
            setParams(tool as unknown as CodeReviewProps);
          }
        }
      }
    }
  }, [messages, setParams]);

  const startResizing = React.useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - e.clientX;

      // Actualizar el estado de colapso basado en el ancho
      setIsCollapsed(newWidth < 50);

      // Limitar solo el ancho máximo
      const clampedWidth = Math.min(newWidth, 1000);
      setChatWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  console.log("messages", messages);

  const [isMenuCollapsed, setIsMenuCollapsed] = React.useState(true);

  const menuItems = [
    {
      text: "Define",
      route: "/define",
      icon: <FileEdit className="h-5 w-5" />,
    },
    {
      text: "Review",
      route: "/review",
      icon: <FileSearch className="h-5 w-5" />,
    },
  ];

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
            <span className="text-sm text-muted-foreground">Menu</span>
          )}
        </div>
        {menuItems.map((item) => (
          <Button
            key={item.text}
            variant="outline"
            className={cn(
              "w-full justify-start normal-case text-base gap-3 bg-gray-50/50 hover:bg-gray-100",
              isMenuCollapsed ? "px-2 justify-center" : ""
            )}
            onClick={() => router.push(item.route)}
          >
            {item.icon}
            {!isMenuCollapsed && item.text}
          </Button>
        ))}
      </div>

      {/* Middle Content Area */}
      <div className="flex-1 border-r p-4 min-h-0 overflow-auto">
        {React.isValidElement(children) &&
          React.cloneElement<any>(children, { params })}
      </div>

      <>
        {/* Resizer with expand button */}
        <div
          className="relative w-1 bg-border hover:bg-primary/50 cursor-col-resize group"
          onMouseDown={startResizing}
        >
          {isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 -translate-y-1/2 -left-4 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => {
                setIsCollapsed(false);
                setChatWidth(400);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Chat Area */}
        <div
          className="flex flex-col min-h-0"
          style={{ width: isCollapsed ? "4px" : `${chatWidth}px` }}
        >
          {!isCollapsed && (
            <>
              {/* Header */}
              <div className="border-b p-4 flex-shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <span>Ask AI</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsCollapsed(true);
                      setChatWidth(4);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="flex items-start min-w-0 w-full"
                    >
                      {message.role !== "user" ? (
                        !message.toolInvocations ? (
                          <Card className="p-3 bg-muted break-words min-w-0 max-w-[85%]">
                            <ReactMarkdown
                              rehypePlugins={[rehypeHighlight]}
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code: ({ className, children }) => {
                                  const match = /language-(\w+)/.exec(
                                    className || ""
                                  );
                                  return match ? (
                                    <CodeBlock className={className}>
                                      {children}
                                    </CodeBlock>
                                  ) : (
                                    <code className={className}>
                                      {children}
                                    </code>
                                  );
                                },
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </Card>
                        ) : (
                          <>
                            <div className="h-6 w-6 rounded-full bg-pink-200 flex-shrink-0" />
                            <span className="font-medium mr-2 flex-shrink-0">
                              AI
                            </span>

                            <div className="min-w-0 max-w-[75%] break-words">
                              {message.toolInvocations?.map(
                                (toolInvocation) => {
                                  const { toolName, toolCallId, state } =
                                    toolInvocation;

                                  if (state === "result") {
                                    if (toolName === "getStockPrice") {
                                      const { result } = toolInvocation;
                                      return (
                                        <Stock key={toolCallId} {...result} />
                                      );
                                    } else if (
                                      toolName === "getMockTableData"
                                    ) {
                                      const { result } = toolInvocation;
                                      return (
                                        <TableData
                                          key={toolCallId}
                                          {...result}
                                        />
                                      );
                                    }
                                  } else {
                                    return (
                                      <div key={toolCallId}>
                                        {toolName === "displayWeather" ? (
                                          <div>Loading weather...</div>
                                        ) : toolName === "getMockTableData" ? (
                                          <div>Loading table data...</div>
                                        ) : (
                                          <div>Loading...</div>
                                        )}
                                      </div>
                                    );
                                  }
                                }
                              )}
                            </div>
                          </>
                        )
                      ) : (
                        <div className="flex items-start gap-2 justify-end w-full">
                          <Card className="p-3 bg-blue-500 text-white break-words overflow-x-hidden min-w-0 max-w-[85%] order-2">
                            <ReactMarkdown
                              rehypePlugins={[rehypeHighlight]}
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code: ({ className, children }) => {
                                  const match = /language-(\w+)/.exec(
                                    className || ""
                                  );
                                  return match ? (
                                    <CodeBlock className={className}>
                                      {children}
                                    </CodeBlock>
                                  ) : (
                                    <code className={className}>
                                      {children}
                                    </code>
                                  );
                                },
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </Card>
                          <div className="flex items-center gap-2 order-3">
                            <span className="font-medium">{message.role}</span>
                            <div className="h-6 w-6 rounded-full bg-pink-200" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
                <TextareaAutosize
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Write what you want..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button type="submit" size="icon" variant="ghost">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      </>
    </div>
  );
}
