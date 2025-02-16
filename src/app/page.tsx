// "use client";

// import React, { useState } from "react";

// interface OutputData {
//   type: "text" | "table";
//   content: string | Record<string, any>[];
// }

// interface TableResponse {
//   type: "table";
//   headers: string[];
//   rows: Record<string, string>[];
// }

// interface TextResponse {
//   type: "text";
//   content: string;
// }

// type OutputData = TableResponse | TextResponse;

// function App() {
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState<OutputData | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch("/api/completion", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ prompt: input }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setOutput(data);
//       setInput("");
//     } catch (error) {
//       console.error("Error:", error);
//       setOutput({
//         type: "text",
//         content: "Hubo un error al obtener la respuesta.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen p-4 bg-gray-50">
//       <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Escribe tu pregunta..."
//           className="w-full p-3 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           disabled={loading}
//         />
//         <button
//           type="submit"
//           disabled={loading || !input.trim()}
//           className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
//         >
//           {loading ? "Generando..." : "Generar"}
//         </button>
//       </form>

//       {output && (
//         <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
//           {output.type === "text" ? (
//             <p className="text-gray-700">{output.content}</p>
//           ) : output.type === "table" ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     {output.headers.map((header) => (
//                       <th
//                         key={header}
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         {header}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {output.rows.map((row, index) => (
//                     <tr key={index}>
//                       {output.headers.map((header, i) => (
//                         <td
//                           key={i}
//                           className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
//                         >
//                           {row[header]}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-red-500">Formato no reconocido</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import TaskCard from "./components/target";
import ChatInterface from "./components/chat-interface";

export default function Page() {
  return (
    <ChatInterface>
      <TaskCard />
    </ChatInterface>
  );
}

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
