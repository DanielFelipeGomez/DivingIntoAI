import ReviewTarget, { ReviewTargetProps } from "./review-target";

export interface CodeReviewProps {
  result: ReviewTargetProps[];
  state: string;
}

export default function CodeReview({ params }: { params?: CodeReviewProps }) {
  console.log("Params:", params);
  return params?.result && params.state === "result" ? (
    params.result?.map((result) => (
      <ReviewTarget key={result.codeBefore} {...result} />
    ))
  ) : (
    <div>No params</div>
  );
}
