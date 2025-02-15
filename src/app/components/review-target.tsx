interface ReviewTargetProps {
  ruleId: string;
  lineNumber: number;
  lineContent: string;
  suggestedFix: string;
}

export const ReviewTarget = ({
  ruleId,
  lineNumber,
  lineContent,
  suggestedFix,
}: ReviewTargetProps) => {
  return (
    <div className="p-4 bg-gray rounded-lg shadow-md border border-gray-200">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-red-600">Error Rule:</span>
          <span>{ruleId}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold">Line Number:</span>
          <span>{lineNumber}</span>
        </div>

        <div className="space-y-1">
          <span className="font-semibold block">Code:</span>
          <code className="block bg-red-900 p-2 rounded">{lineContent}</code>
        </div>

        <div className="space-y-1">
          <span className="font-semibold block">Suggested Fix:</span>
          <p className="text-white-700">{suggestedFix}</p>
        </div>
      </div>
    </div>
  );
};
