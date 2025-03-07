import { Loader2 } from "lucide-react";
import { CodeReviewFragment } from "../ai/code-review-tools/code-review-tool";
import ReviewTarget from "./review-target";

export default function CodeReview({
  params,
  isLoading,
}: {
  params?: CodeReviewFragment[];
  isLoading: boolean;
}) {
  console.log("Que está llegango al code review:", params);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p>This is a demo, please be patient...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {params?.map((result) => (
        <ReviewTarget key={result.codeBefore} {...result} />
      ))}
    </div>
  );
}
