import AuthPage from "./components/auth-page";

export default function Home() {
  return <AuthPage />;
}

// ("use client");

// import TaskCard from "./components/target";
// import ChatInterface from "./components/chat-interface";
// import { ChatProvider } from "./context/chat-context";

// import { useChat } from "ai/react";
// import { Stock } from "./components/stock";
// import { ReviewTarget } from "./components/review-target";
// import TableData from "./components/table-data";

// export default function Page() {
//   const { messages, input, setInput, handleSubmit } = useChat();

//   return (
//     <div>
//       {messages.map((message) => (
//         <div key={message.id}>
//           <div>{message.role}</div>
//           <div>{message.content}</div>

//           <div>
//             {message.toolInvocations?.map((toolInvocation) => {
//               const { toolName, toolCallId, state } = toolInvocation;

//               if (state === "result") {
//                 if (toolName === "getStockPrice") {
//                   const { result } = toolInvocation;
//                   return <Stock key={toolCallId} {...result} />;
//                 } else if (toolName === "codeLint") {
//                   const { result } = toolInvocation;
//                   return <ReviewTarget key={toolCallId} {...result} />;
//                 } else if (toolName === "getMockTableData") {
//                   const { result } = toolInvocation;
//                   return <TableData key={toolCallId} {...result} />;
//                 }
//               } else {
//                 return (
//                   <div key={toolCallId}>
//                     {toolName === "displayWeather" ? (
//                       <div>Loading weather...</div>
//                     ) : toolName === "codeLint" ? (
//                       <div>Loading review code...</div>
//                     ) : toolName === "getMockTableData" ? (
//                       <div>Loading table data...</div>
//                     ) : (
//                       <div>Loading...</div>
//                     )}
//                   </div>
//                 );
//               }
//             })}
//           </div>
//         </div>
//       ))}

//       <form onSubmit={handleSubmit}>
//         <textarea
//           className="w-full h-20 text-gray-900"
//           value={input}
//           onChange={(event) => {
//             setInput(event.target.value);
//           }}
//         />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// }
