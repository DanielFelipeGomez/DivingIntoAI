"use client";

import ChatInterface from "../components/chat-interface";
import CodeReview from "../components/code-review";

export default function ReviewPage() {
  return (
    <ChatInterface>
      <CodeReview
        before={`if (this.placementIds && this.placementIds.length === 0) {`}
        after={`if (this.placementIds?.length === 0) {
if (this.placementIds?.length === 0) {
if (this.placementIds?.length === 0) {
if (this.placementIds?.length === 0) {`}
        explanation="Multiple nested checks can be simplified using Optional Chaining (?.) operator"
        reference={{
          text: "MDN Web Docs - Optional chaining",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining",
        }}
      />
    </ChatInterface>
  );
}
