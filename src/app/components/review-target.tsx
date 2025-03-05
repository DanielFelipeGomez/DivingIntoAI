import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CodeReviewFragment } from "../ai/code-review-tools/code-review-tool";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./code-block";

export default function ReviewTarget(props: CodeReviewFragment) {
  console.log("params", props);
  return props ? (
    <Card className="w-full">
      <div className="divide-y divide-border">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="bg-red-50 dark:bg-red-950/50 rounded-lg">
              <div className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 font-medium border-b border-red-100 dark:border-red-900">
                <X className="h-4 w-4" />
                BEFORE
              </div>
              <div className="p-4">
                <ReactMarkdown
                  rehypePlugins={[rehypeHighlight]}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: ({ className, children }) => {
                      const match = /language-(\w+)/.exec(
                        className || "python"
                      );
                      return match ? (
                        <CodeBlock className={className}>{children}</CodeBlock>
                      ) : (
                        <code className={className}>{children}</code>
                      );
                    },
                  }}
                >
                  {`\`\`\`typescript\n${props.codeBefore}\n\`\`\``}
                </ReactMarkdown>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/50 rounded-lg">
              <div className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 dark:text-green-400 font-medium border-b border-green-100 dark:border-green-900">
                <Check className="h-4 w-4" />
                AFTER
              </div>
              <div className="p-4">
                <ReactMarkdown
                  rehypePlugins={[rehypeHighlight]}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: ({ className, children }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <CodeBlock className={className}>{children}</CodeBlock>
                      ) : (
                        <code className={className}>{children}</code>
                      );
                    },
                  }}
                >
                  {`\`\`\`typescript\n${props.codeAfter}\n\`\`\``}
                </ReactMarkdown>
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {props.explanation}
          </div>
          {props.reference && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Reference: </span>
              <a
                href={props.reference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {props.reference.text}
              </a>
            </div>
          )}
        </div>
      </div>
    </Card>
  ) : (
    <div>No params</div>
  );
}
