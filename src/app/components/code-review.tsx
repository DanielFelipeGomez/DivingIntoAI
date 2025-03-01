import { CodeReviewFragment } from "../ai/code-review-tools/code-review-tool";
import ReviewTarget from "./review-target";

export default function CodeReview({
  params,
}: {
  params?: CodeReviewFragment[];
}) {
  console.log("Params:", params);
  return params?.map((result) => (
    <ReviewTarget key={result.codeBefore} {...result} />
  ));
}
