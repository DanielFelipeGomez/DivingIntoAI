import { Check, Copy, X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CodeReviewProps {
  before: string;
  after: string;
  explanation: string;
  reference?: {
    text: string;
    url: string;
  };
}

export default function CodeReview({
  before,
  after,
  explanation,
  reference,
}: CodeReviewProps) {
  return (
    <Card className="w-full max-w-2xl">
      <div className="divide-y divide-border">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="bg-red-50 dark:bg-red-950/50 rounded-lg">
              <div className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 font-medium border-b border-red-100 dark:border-red-900">
                <X className="h-4 w-4" />
                BEFORE
              </div>
              <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-all">
                {before}
              </pre>
            </div>
            <div className="bg-green-50 dark:bg-green-950/50 rounded-lg">
              <div className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 dark:text-green-400 font-medium border-b border-green-100 dark:border-green-900">
                <Check className="h-4 w-4" />
                AFTER
              </div>
              <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-all relative group">
                {after}
                <button
                  onClick={() => navigator.clipboard.writeText(after)}
                  className="absolute top-2 right-2 p-2 rounded-md opacity-0 group-hover:opacity-100 hover:bg-green-100 dark:hover:bg-green-900 transition-opacity"
                  aria-label="Copy code"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </pre>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{explanation}</div>
          {reference && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Reference: </span>
              <a
                href={reference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {reference.text}
              </a>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
