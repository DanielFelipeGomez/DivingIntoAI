"use client";
import "regenerator-runtime/runtime";

import * as React from "react";
import {
  Menu,
  Send,
  ChevronLeft,
  ChevronRight,
  FileEdit,
  FileSearch,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useChat } from "ai/react";
import { TextareaAutosize } from "@mui/material";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";
import Dictaphone from "./dictaphone";
import { CodeBlock } from "./code-block";
import { TicketData } from "../ai/ticket-tools/ticket-generator-tool";
import { CodeReviewData } from "../ai/code-review-tools/code-review-tool";

export type modelDataResult = TicketData | CodeReviewData;

interface ChildComponentProps {
  params: modelDataResult | undefined;
  contextForModel: Set<string>;
  setContextForModel: (tools: Set<string>) => void;
}

// const getToolMessage = (messages: Message[], toolName: Tools) => {
//   const tool = messages
//     .slice()
//     .reverse()
//     .find((message) =>
//       message?.toolInvocations?.some(
//         (tool) => tool.toolName === toolName && tool.state === resultState
//       )
//     )?.toolInvocations?.[0];

//   if (tool && tool.state === resultState) {
//     return tool.result;
//   }
//   return undefined;
// };

export default function ChatInterface({
  children,
}: {
  children: React.ReactElement<ChildComponentProps>;
}) {
  const [params, setParams] = React.useState<modelDataResult | undefined>(
    undefined
  );
  const [contextForModel, setContextForModel] = React.useState<Set<string>>(
    new Set()
  );
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const contextToUse = Array.from(contextForModel).map((tool) => ({
      tool,
    }));
    setInput(input + `\n\nContext to use: ${JSON.stringify(contextToUse)}`);
    handleSubmit(e);
  };

  console.log("messages", messages);
  React.useEffect(() => {
    if (messages.length > 0) {
      // const targetDataMessage = getToolMessage(messages, Tools.getTicketData);

      // const codeReviewMessage = getToolMessage(
      //   messages,
      //   Tools.getCodeReviewData
      // );

      // const titleMessage = getToolMessage(messages, Tools.getTitleForTicket);
      // const descriptionMessage = getToolMessage(
      //   messages,
      //   Tools.getDescriptionForTicket
      // );

      // console.log("targetDataMessage", targetDataMessage);
      // console.log("codeReviewMessage", codeReviewMessage);

      // if (targetDataMessage) {
      //   console.log("REUSLT HERE", targetDataMessage);
      //   setParams(targetDataMessage as TicketData);
      // }

      // if (codeReviewMessage) {
      //   setParams(codeReviewMessage as CodeReviewData);
      // }

      // if (titleMessage) {
      //   setParams(titleMessage as TicketData);
      // }

      // if (descriptionMessage) {
      //   setParams(descriptionMessage as TicketData);
      // }

      // get last tool and define the params
      const lastTool = messages[messages.length - 1].toolInvocations?.[0];
      if (lastTool && lastTool.state === "result") {
        console.log("lastTool", lastTool);
        setParams(lastTool.result);
      }
    }
  }, [messages, setParams]);

  // Resizer logic
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
          React.cloneElement<ChildComponentProps>(
            children as React.ReactElement<ChildComponentProps>,
            { params, contextForModel, setContextForModel }
          )}
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
                        !message.toolInvocations &&
                        messages[messages.indexOf(message) - 1]?.role ===
                          "user" && (
                          <>
                            <div className="h-6 w-6 rounded-full bg-pink-200 flex-shrink-0" />
                            <span className="font-medium mr-2 flex-shrink-0">
                              AI
                            </span>
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
              {contextForModel.size > 0 && (
                <div className="border-t p-4 flex gap-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex space-x-2 items-center">
                      <span>Only touch the following parts:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="items-center gap-1 bg-red-500 text-white p-2 rounded-lg"
                        onClick={() => setContextForModel(new Set())}
                      >
                        Clear all filters
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 p-2 rounded-lg">
                      {Array.from(contextForModel).map((tool) => (
                        <div
                          key={tool}
                          className="flex items-center gap-1 bg-blue-500 text-white p-2 rounded-lg"
                        >
                          <span>{tool}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4"
                            onClick={() => {
                              const newTools = new Set(contextForModel);
                              newTools.delete(tool);
                              setContextForModel(newTools);
                            }}
                          >
                            <X className="h-5 w-5 hover:opacity-70 rounded-full" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <form onSubmit={onSubmit} className="border-t p-4 flex gap-2">
                <TextareaAutosize
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Write what you want..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSubmit(
                        e as unknown as React.FormEvent<HTMLFormElement>
                      );
                    }
                  }}
                />
                <Dictaphone setInput={setInput} />
                <Button type="submit" size="icon" variant="ghost">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      </>
    </div>
  );
}
