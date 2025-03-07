"use client";
import "regenerator-runtime/runtime";

import * as React from "react";
import {
  Send,
  ChevronLeft,
  ChevronRight,
  X,
  FileUp,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useChat } from "ai/react";
import { CardContent, TextareaAutosize } from "@mui/material";
import { experimental_useObject } from "ai/react";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";
import Dictaphone from "./dictaphone";
import { CodeBlock } from "./code-block";
import { TicketData } from "../ai/ticket-tools/ticket-generator-tool";
import { CodeReviewData } from "../ai/code-review-tools/code-review-tool";
import { codeReviewsSchema } from "@/lib/code-review-schema";
import WhisperTranscriber from "./whisper-transcriber";

export type modelDataResult = TicketData | CodeReviewData;

interface ChildComponentProps {
  params: modelDataResult | undefined;
  contextForModel: Set<string>;
  setContextForModel: (tools: Set<string>) => void;
  isLoading: boolean;
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
  dialogTitle = "Ask AI",
  dialogHeaderHeight = 57,
  dialogFooterHeight = 200,
  showPdfInsert = false,
  inDialog = false,
}: {
  children: React.ReactElement<ChildComponentProps>;
  dialogTitle?: string;
  dialogHeaderHeight?: number;
  dialogFooterHeight?: number;
  showPdfInsert?: boolean;
  inDialog?: boolean;
}) {
  const [params, setParams] = React.useState<modelDataResult | undefined>(
    undefined
  );
  const [contextForModel, setContextForModel] = React.useState<Set<string>>(
    new Set()
  );
  const [chatWidth, setChatWidth] = React.useState(400);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const contextAreaRef = React.useRef<HTMLDivElement>(null);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading: isLoadingChat,
  } = useChat({
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

  React.useEffect(() => {
    if (messages.length > 0) {
      // get last tool and define the params
      const lastTool = messages[messages.length - 1].toolInvocations?.[0];
      if (lastTool && lastTool.state === "result") {
        console.log("lastTool", lastTool);
        setParams(lastTool.result);
      }
    }
  }, [messages, setParams]);

  const [files, setFiles] = React.useState<File[]>([]);
  const [pdfComplementary, setPdfComplementary] = React.useState<
    FileList | undefined
  >(undefined);
  const pdfComplementaryInputRef = React.useRef<HTMLInputElement>(null);

  const {
    submit,
    object: partialQuestions,
    isLoading: isLoadingCodeReviewPDF,
  } = experimental_useObject({
    api: "/api/code-review",
    schema: codeReviewsSchema,
    initialValue: undefined,
    onError: (error) => {
      console.error("Failed to generate quiz. Please try again.", error);
      setFiles([]);
    },
    onFinish: ({ object }) => {
      setParams(object as unknown as CodeReviewData);
    },
  });

  React.useEffect(() => {
    setParams(partialQuestions as unknown as CodeReviewData);
  }, [partialQuestions]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // if (isSafari && isDragging) {
    if (isSafari) {
      console.error(
        "Safari does not support drag & drop. Please use the file picker."
      );
      return;
    }

    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 5 * 1024 * 1024
    );
    console.log(validFiles);

    if (validFiles.length !== selectedFiles.length) {
      console.error("Only PDF files under 5MB are allowed.");
    }

    setFiles(validFiles);
  };

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitWithFiles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file),
      }))
    );
    try {
      submit({ files: encodedFiles });
    } catch (error) {
      console.error("Error submitting files:", error);
    }
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth < 200) {
          setIsCollapsed(true);
          setChatWidth(4);
        } else {
          setIsCollapsed(false);
          setChatWidth(Math.max(300, Math.min(800, newWidth)));
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  return (
    <div
      className={`flex h-full bg-background relative overflow-hidden ${
        isDragging ? "select-none" : ""
      }`}
      ref={chatContainerRef}
    >
      <div
        className={
          !inDialog
            ? "flex-1 border-r h-fulloverflow-hidden"
            : "flex-1 border-r h-[600px] overflow-hidden"
        }
      >
        <div className="h-full overflow-auto p-4">
          {React.isValidElement(children) &&
            React.cloneElement<ChildComponentProps>(
              children as React.ReactElement<ChildComponentProps>,
              {
                params,
                contextForModel,
                setContextForModel,
                isLoading: isLoadingChat,
              }
            )}
        </div>
      </div>

      {/* Draggable divider */}
      <div
        className="w-1 hover:w-1 hover:bg-blue-400 cursor-col-resize transition-colors flex items-center"
        onMouseDown={handleMouseDown}
        style={{
          backgroundColor: isDragging ? "#60A5FA" : "transparent",
        }}
      >
        {isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 transform -translate-x-full"
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
        className={
          !inDialog
            ? "flex flex-col relative h-full overflow-hidden"
            : "flex flex-col relative h-[600px] overflow-hidden"
        }
        style={{
          width: isCollapsed ? "4px" : `${chatWidth}px`,
          transition: isDragging ? "none" : "width 0.3s ease",
        }}
      >
        {!isCollapsed && (
          <>
            {/* Header */}
            <div className="border-b p-4 bg-background z-10 flex-none">
              <div className="flex items-center justify-between gap-2">
                <span>{dialogTitle}</span>
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
            <div
              className="overflow-y-auto flex-1"
              style={{
                maxHeight: `calc(100% - ${dialogHeaderHeight}px - ${dialogFooterHeight}px${
                  contextForModel.size > 0
                    ? " - var(--context-height, 0px)"
                    : ""
                })`,
              }}
            >
              <div className="p-4 space-y-4">
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
                                  <code className={className}>{children}</code>
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

            {/* Filters and form area */}
            <div className="absolute bottom-0 left-0 right-0">
              {/* Filters area - Just above the input area */}
              {contextForModel.size > 0 && (
                <div
                  className="border-t bg-background z-10"
                  ref={contextAreaRef}
                >
                  <div className="p-4 flex gap-2">
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
                </div>
              )}

              {/* Input form - Last row in grid or fixed below in absolute position */}

              {/* Pdf form example of new endpoint */}
              <CardContent
                className={`${!showPdfInsert ? "hidden" : " border-t"}`}
              >
                <form onSubmit={handleSubmitWithFiles} className="space-y-4">
                  <div
                    className={`relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/50`}
                  >
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="application/pdf"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground text-center">
                      {files.length > 0 ? (
                        <span className="font-medium text-foreground">
                          {files[0].name}
                        </span>
                      ) : (
                        <span>Drop your PDF here or click to browse.</span>
                      )}
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={files.length === 0}
                  >
                    {isLoadingCodeReviewPDF ? (
                      <span className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Generating Code Review...</span>
                      </span>
                    ) : (
                      "Generate Code Review"
                    )}
                  </Button>
                </form>
              </CardContent>

              {/* Pdf form */}
              <form
                onSubmit={(event) => {
                  handleSubmit(event, {
                    experimental_attachments: pdfComplementary,
                  });

                  setPdfComplementary(undefined);

                  if (pdfComplementaryInputRef.current) {
                    pdfComplementaryInputRef.current.value = "";
                  }
                }}
                className="p-4 flex flex-col gap-2 border-t bg-background z-10"
              >
                <input
                  type="file"
                  onChange={(event) => {
                    if (event.target.files) {
                      setPdfComplementary(event.target.files);
                    }
                  }}
                  multiple
                  ref={pdfComplementaryInputRef}
                />
                <Button type="submit" variant="default" className="w-full">
                  Send with PDF
                  <Send className="h-4 w-4" />
                </Button>
              </form>

              {/* Input form */}
              <form
                onSubmit={onSubmit}
                className="p-4 flex gap-2 border-t bg-background z-10"
              >
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
                <div className="flex space-x-2">
                  <Dictaphone setInput={setInput} />
                  <WhisperTranscriber setInput={setInput} />
                </div>
                <Button type="submit" size="icon" variant="ghost">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
