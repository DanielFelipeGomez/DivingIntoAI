"use client";

import ChatInterface from "../components/chat-interface";
import CodeReview from "../components/code-review";

export default function ReviewPage() {
  return (
    <ChatInterface>
      <CodeReview params={undefined} />
    </ChatInterface>
  );
}
