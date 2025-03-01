import { Button } from "@/components/ui/button";
import React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const CodeBlock = ({
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
