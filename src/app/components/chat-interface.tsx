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
  inDialog = false,
  dialogTitle = "Ask AI",
  dialogHeaderHeight = 57, // Altura por defecto del header del diálogo
  dialogFooterHeight = 65, // Altura por defecto del footer del diálogo
  onDataChange,
  showPdfInsert = false,
}: {
  children: React.ReactElement<ChildComponentProps>;
  inDialog?: boolean;
  dialogTitle?: string;
  dialogHeaderHeight?: number;
  dialogFooterHeight?: number;
  onDataChange?: (data: {
    params: modelDataResult | undefined;
    contextForModel: Set<string>;
  }) => void;
  showPdfInsert?: boolean;
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
  const contextAreaRef = React.useRef<HTMLDivElement>(null);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

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

  // Efecto para actualizar la altura del área de contexto y adaptarse al contenedor padre
  React.useEffect(() => {
    const updateContextHeight = () => {
      if (contextAreaRef.current) {
        document.documentElement.style.setProperty(
          "--context-height",
          `${contextAreaRef.current.offsetHeight}px`
        );
      } else {
        document.documentElement.style.setProperty("--context-height", "0px");
      }
    };

    // Actualizar altura cuando cambia el contexto
    updateContextHeight();

    // También actualizar en la próxima renderización para capturar cualquier cambio de tamaño
    requestAnimationFrame(updateContextHeight);
  }, [contextForModel.size]);

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

  // Efecto específico para ajustar el comportamiento de scroll en el diálogo
  React.useEffect(() => {
    if (inDialog && chatContainerRef.current) {
      // Forzar que no haya scroll en el diálogo o sus contenedores padres
      const applyNoScrollToParents = () => {
        if (!chatContainerRef.current) return;

        // Aplicar al contenedor del chat
        chatContainerRef.current.style.overflow = "hidden";

        // Aplicar a los padres hasta el body
        let parent = chatContainerRef.current.parentElement;
        while (parent && parent !== document.body) {
          parent.style.overflow = "hidden";
          if (parent.parentElement) {
            parent = parent.parentElement;
          } else {
            break;
          }
        }
      };

      // Aplicar inmediatamente
      applyNoScrollToParents();

      // Y también después de un pequeño retraso para asegurar que se aplica después de cualquier renderizado
      const timeoutId = setTimeout(applyNoScrollToParents, 100);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [inDialog]);

  // Notificamos cambios a componentes externos como el diálogo
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange({ params, contextForModel });
    }
  }, [params, contextForModel, onDataChange]);

  const [files, setFiles] = React.useState<File[]>([]);

  const {
    submit,
    object: partialQuestions,
    isLoading,
  } = experimental_useObject({
    api: "/api/code-review",
    schema: codeReviewsSchema,
    initialValue: undefined,
    onError: (error) => {
      console.error("Failed to generate quiz. Please try again.", error);
      setFiles([]);
    },
    onFinish: ({ object }) => {
      console.log("____________object_______________", object);

      setParams(object as unknown as CodeReviewData);
    },
  });

  React.useEffect(() => {
    console.log(
      "____________partialQuestions_______________",
      partialQuestions
    );
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
    submit({ files: encodedFiles });
  };

  return (
    <div
      className={`flex ${
        inDialog ? "h-full max-h-full overflow-hidden" : "h-full"
      } bg-background relative`}
      ref={chatContainerRef}
      style={inDialog ? { overflow: "hidden" } : undefined}
    >
      {!inDialog && (
        <>
          {/* Middle Content Area - Solo visible cuando no está en diálogo */}
          <div className="flex-1 border-r p-4 overflow-auto">
            {React.isValidElement(children) &&
              React.cloneElement<ChildComponentProps>(
                children as React.ReactElement<ChildComponentProps>,
                { params, contextForModel, setContextForModel }
              )}
          </div>

          {/* Resizer - Solo visible cuando no está en diálogo */}
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
        </>
      )}

      {/* Chat Area - Usando Grid para modo diálogo */}
      <div
        className={`${
          inDialog
            ? "grid grid-rows-[auto_1fr_auto] h-full w-full overflow-hidden"
            : "flex flex-col relative"
        }`}
        style={
          inDialog
            ? { overflow: "hidden", maxHeight: "100%" }
            : { width: isCollapsed ? "4px" : `${chatWidth}px` }
        }
      >
        {(!isCollapsed || inDialog) && (
          <>
            {/* Header - En modo grid es la primera fila */}
            <div
              className={`border-b p-4 bg-background z-10 flex-none ${
                !inDialog ? "absolute top-0 left-0 right-0" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span>{dialogTitle}</span>
                {!inDialog && (
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
                )}
              </div>
            </div>

            {/* Messages - En modo grid es la fila central con scroll */}
            <div
              className={`${
                inDialog
                  ? "overflow-y-auto min-h-0 max-h-full"
                  : "absolute inset-x-0 overflow-y-auto"
              }`}
              style={
                !inDialog
                  ? {
                      top: `${dialogHeaderHeight}px`,
                      bottom:
                        contextForModel.size > 0
                          ? `calc(${dialogFooterHeight}px + var(--context-height, 0px))`
                          : `${dialogFooterHeight}px`,
                    }
                  : { maxHeight: "100%" }
              }
            >
              <div className={`p-4 space-y-4`}>
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

            {/* Área de filtros y formulario */}
            <div
              className={`${
                inDialog ? "flex-none" : "absolute bottom-0 left-0 right-0"
              }`}
            >
              {/* Área de filtros - Justo sobre el área de entrada */}
              {contextForModel.size > 0 && (
                <div
                  className="border-t bg-background z-10"
                  style={!inDialog ? { bottom: "65px" } : undefined}
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

              {/* Formulario de entrada - Última fila en grid o fijo abajo en posición absoluta */}
              <CardContent className={`${!showPdfInsert ? "hidden" : ""}`}>
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
                    {isLoading ? (
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

      {/* Renderizar los hijos cuando está en diálogo - Ocultos pero necesarios para la lógica */}
      {inDialog && (
        <div className="hidden">
          {React.isValidElement(children) &&
            React.cloneElement<ChildComponentProps>(
              children as React.ReactElement<ChildComponentProps>,
              { params, contextForModel, setContextForModel }
            )}
        </div>
      )}
    </div>
  );
}
