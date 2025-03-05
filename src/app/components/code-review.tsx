import { CodeReviewFragment } from "../ai/code-review-tools/code-review-tool";
import ReviewTarget from "./review-target";

export default function CodeReview({
  params,
}: {
  params?: CodeReviewFragment[];
}) {
  console.log("Que está llegango al code review:", params);
  return (
    <div className="flex flex-col gap-4">
      {params?.map((result) => (
        <ReviewTarget key={result.codeBefore} {...result} />
      ))}
    </div>
  );
}
